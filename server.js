const path = require('node:path');
const express = require('express');
const session = require('express-session');
const { PermissionsBitField } = require('discord.js');
const { getGuildSettings, setGuildSetting } = require('./data/settings');

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  SESSION_SECRET,
} = process.env;

function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Belum login' });
  next();
}

function startDashboard(client) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(
    session({
      secret: SESSION_SECRET || 'ganti-secret-ini',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 6 },
    })
  );

  app.get('/auth/discord', (req, res) => {
    const url = new URL('https://discord.com/api/oauth2/authorize');
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('redirect_uri', REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'identify guilds');
    res.redirect(url.toString());
  });

  app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.redirect('/?error=no_code');

    try {
      const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!tokenRes.ok) throw new Error('Gagal menukar code dengan token');
      const tokenData = await tokenRes.json();

      const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const user = await userRes.json();

      const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const userGuilds = await guildsRes.json();

      const manageable = userGuilds
        .filter((g) => (BigInt(g.permissions) & PermissionsBitField.Flags.ManageGuild) === PermissionsBitField.Flags.ManageGuild)
        .filter((g) => client.guilds.cache.has(g.id))
        .map((g) => ({ id: g.id, name: g.name, icon: g.icon }));

      req.session.user = { id: user.id, username: user.username, avatar: user.avatar };
      req.session.guilds = manageable;

      res.redirect('/dashboard.html');
    } catch (error) {
      console.error('❌ OAuth error:', error.message || error);
      res.redirect('/?error=oauth_failed');
    }
  });

  app.get('/api/me', requireLogin, (req, res) => {
    res.json({ user: req.session.user, guilds: req.session.guilds });
  });

  app.get('/api/guilds/:id/channels', requireLogin, (req, res) => {
    const allowed = req.session.guilds.find((g) => g.id === req.params.id);
    if (!allowed) return res.status(403).json({ error: 'Kamu tidak punya akses ke server ini' });

    const guild = client.guilds.cache.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'Bot tidak ada di server ini' });

    const channels = guild.channels.cache
      .filter((ch) => ch.isTextBased() && !ch.isThread())
      .map((ch) => ({ id: ch.id, name: ch.name }));

    res.json({ channels });
  });

  app.get('/api/guilds/:id/settings', requireLogin, (req, res) => {
    const allowed = req.session.guilds.find((g) => g.id === req.params.id);
    if (!allowed) return res.status(403).json({ error: 'Kamu tidak punya akses ke server ini' });

    res.json(getGuildSettings(req.params.id));
  });

  app.post('/api/guilds/:id/settings', requireLogin, (req, res) => {
    const allowed = req.session.guilds.find((g) => g.id === req.params.id);
    if (!allowed) return res.status(403).json({ error: 'Kamu tidak punya akses ke server ini' });

    const { welcomeChannelId } = req.body;
    setGuildSetting(req.params.id, 'welcomeChannelId', welcomeChannelId || null);
    res.json({ success: true });
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🌐 Dashboard jalan di port ${PORT}`);
  });
}

module.exports = { startDashboard };

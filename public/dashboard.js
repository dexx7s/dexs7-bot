let currentGuildId = null;

async function init() {
  const res = await fetch('/api/me');
  if (!res.ok) {
    window.location.href = '/';
    return;
  }

  const data = await res.json();
  const list = document.getElementById('guildList');

  if (data.guilds.length === 0) {
    list.innerHTML = '<p>Tidak ada server yang bisa kamu atur. Pastikan bot sudah diundang ke server dan kamu punya izin Manage Server.</p>';
    return;
  }

  data.guilds.forEach((guild) => {
    const card = document.createElement('div');
    card.className = 'card guild-card';
    card.innerHTML = `<span>${guild.name}</span><button class="btn small">Atur</button>`;
    card.querySelector('button').addEventListener('click', () => openGuild(guild));
    list.appendChild(card);
  });
}

async function openGuild(guild) {
  currentGuildId = guild.id;
  document.getElementById('guildName').textContent = guild.name;
  document.getElementById('settingsPanel').classList.remove('hidden');
  document.getElementById('statusMsg').textContent = '';

  const [channelsRes, settingsRes] = await Promise.all([
    fetch(`/api/guilds/${guild.id}/channels`),
    fetch(`/api/guilds/${guild.id}/settings`),
  ]);

  const { channels } = await channelsRes.json();
  const settings = await settingsRes.json();

  const select = document.getElementById('channelSelect');
  select.innerHTML = '<option value="">-- Tidak ada --</option>';
  channels.forEach((ch) => {
    const opt = document.createElement('option');
    opt.value = ch.id;
    opt.textContent = `#${ch.name}`;
    if (settings.welcomeChannelId === ch.id) opt.selected = true;
    select.appendChild(opt);
  });
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  const welcomeChannelId = document.getElementById('channelSelect').value;
  const statusMsg = document.getElementById('statusMsg');

  const res = await fetch(`/api/guilds/${currentGuildId}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ welcomeChannelId }),
  });

  statusMsg.textContent = res.ok ? '✅ Tersimpan!' : '❌ Gagal menyimpan.';
});

init();

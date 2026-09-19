const fs = require('node:fs');
const path = require('node:path');

const DATA_FILE = path.join(__dirname, 'settings.json');

function loadAll() {
  if (!fs.existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveAll(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getGuildSettings(guildId) {
  const all = loadAll();
  return all[guildId] || {};
}

function setGuildSetting(guildId, key, value) {
  const all = loadAll();
  if (!all[guildId]) all[guildId] = {};
  all[guildId][key] = value;
  saveAll(all);
}

module.exports = { getGuildSettings, setGuildSetting };

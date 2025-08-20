const axios = require('axios');
let fbSessions = {};

module.exports = {
  name: 'fbBotM.R.Gesa',
  trigger: text => text.startsWith('.fb'),
  run: async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const videoUrl = msg.message.conversation.split(' ')[1];

    if (!videoUrl) {
      await sock.sendMessage(jid, { text: '📎 කරුණාකර Facebook video ලින්ක් එකක් යවන්න: `.fb https://fb.com/xyz`' });
      return;
    }

    fbSessions[jid] = videoUrl;

    await sock.sendMessage(jid, {
      text: `📥 FACEBOOK වීඩියෝ බාගැනීම\n\nඔබට අවශ්‍ය විකල්පය තෝරන්න:\n1️⃣ SD Video\n2️⃣ HD Video\n3️⃣ MP3 Audio\n\n🔧 Powered by M.R.Gesa`
    });
  },

  onReply: async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const reply = msg.message.conversation.trim();
    const videoUrl = fbSessions[jid];

    if (!videoUrl) return;

    let api = `https://api.vevioz.com/api/button.php?url=${videoUrl}`;
    let res = await axios.get(api);
    let html = res.data;

    // Extract direct links (simplified regex)
    const sdMatch = html.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"/);
    const hdMatch = html.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"[^>]*>HD/);
    const mp3Match = html.match(/href="(https:\/\/[^"]+\.mp3[^"]*)"/);

    let fileUrl;
    let caption;

    switch (reply) {
      case '1':
        fileUrl = sdMatch?.[1];
        caption = '📽️ ඔබගේ SD වීඩියෝව';
        break;
      case '2':
        fileUrl = hdMatch?.[1];
        caption = '🎞️ ඔබගේ HD වීඩියෝව';
        break;
      case '3':
        fileUrl = mp3Match?.[1];
        caption = '🎧 ඔබගේ MP3 Audio';
        break;
      default:
        await sock.sendMessage(jid, { text: '❌ වැරදි විකල්පයකි. කරුණාකර 1, 2 හෝ 3 reply කරන්න.' });
        return;
    }

    if (!fileUrl) {
      await sock.sendMessage(jid, { text: '⚠️ බාගැනීමේ ලින්ක් එක ලබාගත නොහැක. වෙනත් ලින්ක් එකක් උත්සාහ කරන්න.' });
      return;
    }

    if (reply === '3') {
      await sock.sendMessage(jid, {
        audio: { url: fileUrl },
        mimetype: 'audio/mp4',
        ptt: true
      });
    } else {
      await sock.sendMessage(jid, {
        video: { url: fileUrl },
        caption
      });
    }

    await sock.sendMessage(jid, { text: '✅ බාගැනීම සාර්ථකයි!\n🔧 Powered by M.R.Gesa' });
    delete fbSessions[jid];
  }
};

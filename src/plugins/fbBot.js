import axios from "axios";

let fbSessions = {};

export default {
  name: 'fbBotM.R.Gesa',
  trigger: text => text.startsWith('.fb'),

  run: async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const videoUrl = msg.message.conversation.split(' ')[1];

    if(!videoUrl) {
      await sock.sendMessage(jid, { text: '📎 Facebook video link එකක් යවන්න: `.fb URL`' });
      return;
    }

    fbSessions[jid] = videoUrl;

    await sock.sendMessage(jid, { text: `📥 Facebook video download\nReply:\n1️⃣ SD Video\n2️⃣ HD Video\n3️⃣ MP3 Audio\n\n🔧 Powered by M.R.Gesa` });
  },

  onReply: async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const videoUrl = fbSessions[jid];
    if(!videoUrl) return;

    try {
      const api = `https://api.vevioz.com/api/button.php?url=${videoUrl}`;
      const html = (await axios.get(api)).data;

      const sdMatch = html.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"/);
      const hdMatch = html.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"[^>]*>HD/);
      const mp3Match = html.match(/href="(https:\/\/[^"]+\.mp3[^"]*)"/);

      const reply = msg.message.conversation.trim();
      let fileUrl, caption;

      switch(reply){
        case '1': fileUrl = sdMatch?.[1]; caption='📽️ SD Video'; break;
        case '2': fileUrl = hdMatch?.[1]; caption='🎞️ HD Video'; break;
        case '3': fileUrl = mp3Match?.[1]; caption='🎧 MP3'; break;
        default: return sock.sendMessage(jid, { text:'❌ 1,2,3 reply කරන්න.' });
      }

      if(!fileUrl) return sock.sendMessage(jid, { text:'⚠️ Download link not found.' });

      if(reply === '3') {
        await sock.sendMessage(jid, { audio:{url:fileUrl}, mimetype:'audio/mp4', ptt:true });
      } else {
        await sock.sendMessage(jid, { video:{url:fileUrl}, caption });
      }

      await sock.sendMessage(jid, { text:'✅ Download finished! 🔧 Powered by M.R.Gesa' });
      delete fbSessions[jid];

    } catch(err) {
      console.error(err);
      await sock.sendMessage(jid, { text:'❌ Error occurred while fetching download links.' });
    }
  }
};

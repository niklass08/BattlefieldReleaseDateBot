import { config } from "./config.js";
import Discord from "discord.js";
import cron from "cron";
import moment from "moment";

const client = new Discord.Client();
client.login(config.BOT_TOKEN);
client.on("message", (message) => {
  if (message.content === "!getDate") {
    message.channel.send(
      `Battlefield release date: ${config.BATTLEFIELD_DATE}`
    );
  }
});

client.on("ready", () => {
  const generalChannels = client.channels.cache
    .map((channelObject) => ({
      type: channelObject.type,
      name: channelObject.name,
      id: channelObject.id,
    }))
    .filter((channel) => channel.type === "text" && channel.name === "general");

  generalChannels.forEach(async (channelObject) => {
    const channel = await client.channels.fetch(channelObject.id);
    const releaseDateReminder = new cron.CronJob(
      "0 8 * * *",
      () => {
        const now = new Date();
        const start = moment(now);
        const end = moment(config.BATTLEFIELD_DATE);
        const diff = end.diff(start, "days");
        channel.send("Battlefield 2042 J-" + diff);
      },
      null,
      true,
      "Europe/Paris"
    );
    releaseDateReminder.start();
  });
});

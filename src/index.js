const discord = require('discord.js');
const firebaseAdmin = require("firebase-admin");

const client = new discord.Client();
require('dotenv').config();

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        "type": process.env.TYPE,
        "project_id": process.env.PROJECT_ID,
        "private_key_id": process.env.PRIVATE_KEY_ID,
        "private_key": process.env.PRIVATE_KEY,
        "client_email": process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": process.env.AUTH_URI,
        "token_uri": process.env.TOKEN_URL,
        "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
    }),
    databaseURL: "https://null-ba189.firebaseio.com"
})

let database = firebaseAdmin.database();
let users = database.ref("/users");
let prefix = `!`;
let parentCategoryID = '639304634149634059';

client.on('ready', () => {
    console.log("Null is online.");
    client.user.setActivity('with your grades.', {type: 'PLAYING'});
    //let supportCategory = client.channels.cache.find( category => category.name == "Support" && category.type == "category");
});

client.on('message', async message => {
    if (message.content.startsWith(`${prefix}tutor`)) {
        users.child(message.author.id).once("value", function(snapshot) {
            if (snapshot.val() != null) {
                message.reply("you have already created a session.")
                .then(reply => {
                    reply.delete({ timeout: 5000 })
                        .catch(console.error);
                });
            } else {
                message.guild.channels.create(`${message.author.username}-tutoring`)
                .then( async channel => {
                    users.child(message.author.id).update({
                        channel_id: channel.id
                    })
                    await channel.setParent(parentCategoryID, {lockPermissions: true})
                    channel.setTopic(`This is ${message.author.username}'s tutoring session. Once this session has ended please close this channel by saying: !closeSession`);
                    channel.send(`${message.author} your tutoring session has been created. Once your tutoring session finished, please close this channel by typing: !end`);
                })
            }
        })
        message.author.lastMessage.delete({timeout: 6000});
    }

    if (message.content.startsWith(`${prefix}end`)) {
       users.child(message.author.id).once("value", function(snapshot) {
           if ((snapshot.val().channel_id == message.channel.id) && users.child(message.author.id).key == message.author.id) {
               users.child(message.author.id).remove();
               message.channel.delete();
           }
       })
    }
})

client.login(process.env.TOKEN);
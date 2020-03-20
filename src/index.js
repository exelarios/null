const discord = require('discord.js');
const client = new discord.Client();

//const key = require("../key.js").token;

let prefix = `!`;
let parentCategoryID = '639304634149634059';

client.on('ready', () => {
    console.log("Null is online.");
    client.user.setActivity('with your grades.', {type: 'PLAYING'})
})

let inSession = [];
let owners = [];
console.log(inSession);

client.on('message', async message => {
    if (message.content.startsWith(`${prefix}tutor`)) {
        owners.push(message.author.username);
        if (!checkSession(owners)){ // Check if there's duplicate for for owners 
            await message.guild.channels.create(`${message.author.username}-tutoring`)
            .then( channel => {
                inSession.push({'owner': message.author.username, 'channel': `${channel.id}`});
                //channelSession.push(`${channel.id}`);
                channel.setTopic(`This is ${message.author.username}'s tutoring session. 
                Once this session has ended please close this channel by saying: !closeSession`);
                channel.setParent(parentCategoryID);
                channel.send(`${message.author} your tutoring session has been created. Once your tutoring session has completed, please close this channel by typing: !closeSession`);
            })
            .catch( err => {
                console.log(err);
            })
            message.author.lastMessage.delete();
            //console.log(inSession);
        } else {
            message.reply(`you already created a tutoring session.`);
        }
    }


    if (message.content.startsWith(`${prefix}endSession`)) {
        if (isSameChannel(inSession, message.channel.id) && isSameOwner(inSession, `${message.author}`)) {
            console.log("Index: " + findIndexByChannel(inSession, message.channel.id));
            inSession.splice(findIndexByChannel(inSession, message.channel.id), 1);
            owners.splice(findIdexByOwner(owners, `${message.author}`), 1);
            message.channel.delete();
            console.log(inSession);
            console.log(owners);
        }
    }

    if (message.content.startsWith(`${prefix}sessions`)) {
        message.channel.send("Session: " + JSON.stringify(inSession));
        //message.channel.send("Owners: " + JSON.stringify(owners));
        console.log(inSession);
        console.log(owners);     
    }


    if (message.content.startsWith(`${prefix}regen`)) {
        inSession.length = 0;
        owners.length = 0;
    }

    if (message.content.startsWith("null")) {
        message.channel.send("Did someone say my name?");
    }
  });

// No idea how this function works; but it works. :>
let checkSession = args => { 
    let valuesSoFar = Object.create(null);
    for (let i = 0; i < args.length; i++) {
        let value = args[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

let findIdexByOwner = (args, owner) => {
    for (let i = 0; i < args.length; i++){
        if (args[i] == owner) {
            return i;
        }
    }
}

let findIndexByChannel = (args, channel) => {
    for (let i = 0; i < args.length; i++){
        if (args[i].Channel == channel) {
            return i;
        }
    }
}

let isSameChannel = (args, channelId) => {
    for (let i = 0; i < args.length; i++){
        console.log(args[i].Channel == channelId);
        if (args[i].Channel == channelId) {
            return true;
        }
    }
    return false;
}

let isSameOwner = (args, owner) => {
    for (let i = 0; i < args.length; i++){
        console.log(args[i].Owner == owner);
        if (args[i].Owner == owner) {
            return true;
        }
    }
    return false;
}



//client.login(key);
client.login(process.env.token);
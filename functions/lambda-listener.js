const MailListener = require("mail-listener2");

const logUrl = 'https://gib2018requestbin.herokuapp.com/q1cjtfq1';

const log = requestBinLogger;

const requestBinLogger = (message) => {
  fetch(logUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(message)
  })
}

export.handler = (event, context, callback) => {

  const mailListener = new MailListener({
    username: "test@codesys.fi",
    password: "pienivihreamies",
    host: "imap.zoho.eu",
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX", // mailbox to monitor
    searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
  });

  mailListener.start(); // start listening

  // stop listening
  //mailListener.stop();

  mailListener.on("server:connected", function(){
    log("imapConnected");
  });

  mailListener.on("server:disconnected", function(){
    log("imapDisconnected");
  });

  mailListener.on("error", function(err){
    log(err);
  });

  mailListener.on("mail", function(mail, seqno, attributes){
    // do something with mail object including attachments
    log("emailParsed", mail);
    // mail processing code goes here
  });

  mailListener.on("attachment", function(attachment){
    log(attachment.path);
  });

  // it's possible to access imap object from node-imap library for performing additional actions. E.x.
  //mailListener.imap.move(:msguids, :mailboxes, function(){})

}

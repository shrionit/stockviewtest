var admin = require("firebase-admin");

var serviceAccount = require("./stockview_firebase_key.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stockview-aa053-default-rtdb.firebaseio.com"
});

// db.collection('stockhunter').get().then(d => {
//   d.forEach((doc) => {
//     console.log(`${doc.id} => `, doc.data());
//   });
// });
// db.collection('stockhunter').doc('B').set({
//   name: "Shyam",
//   watchlist: ['c', 'd'],
//   userid: "002",
// });

const db = admin.firestore();

module.exports.handleSignIn = function (user) {
  return new Promise((resolve, reject) => {
    if (user) {
      db.collection('stockhunter').doc(user.uid).get().then(o => {
        if (!o.exists) {
          db.collection('stockhunter').doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            watchlist: [],
            provider: user.providerId
          }).then(() => resolve()).catch(e => reject(e));
        } else {
          console.log("Exists", o);
          resolve(o);
        }
      });
    }
  });
}

module.exports.viewWatchlist = function (user) {
  if (user) {
    return db.collection('stockhunter').doc(user.uid).get();
  } else {
    return null;
  }
}

module.exports.addWatchlist = function (user, stockid) {
  if (user) {
    return db.collection('stockhunter').doc(user.uid).update({
      watchlist: admin.firestore.FieldValue.arrayUnion(stockid)
    });
  }
}

module.exports.removeWatchlist = function (user, stockid) {
  if (user) {
    return db.collection('stockhunter').doc(user.uid).update({
      watchlist: admin.firestore.FieldValue.arrayRemove(stockid)
    });
  }
}
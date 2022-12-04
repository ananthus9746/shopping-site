// // Your web app's Firebase configuration ENTER YOUR FIREBASE DETAILS HERE



// var firebaseConfig = {
//   apiKey: "AIzaSyAcFcoVGkBPK5rxa7lIDZsGfBuKFDbWejc",
//   authDomain: "ecofriend-otp-authentication.firebaseapp.com",
//   projectId: "ecofriend-otp-authentication",
//   storageBucket: "ecofriend-otp-authentication.appspot.com",
//   messagingSenderId: "551536661159",
//   appId: "1:551536661159:web:7ead4ac8b703eb8748c182",
//   measurementId: "G-28137EZMNV",
// };


// firebase.initializeApp(firebaseConfig);

// var sign_out = document.querySelector("#signOut");

// var login_form = document.querySelector("#loginForm");
// var message = document.querySelector("#messageDiv");
// var message_value = document.querySelector(".message");
// var otp_form = document.querySelector("#otpForm");

// if (window.location.pathname === "/login-with-phone-number") {
//   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
//     "sign-in-button",
//     {
//       size: "invisible",
//       callback: (response) => {
//         console.log("captcha verified");
//       },
//     }
//   );

  
//   login_form.addEventListener("submit", function (e) {
//     e.preventDefault();
//     let phone_number = "+91" + login_form.phone.value;

//     const appVerifier = window.recaptchaVerifier;

//     firebase
//       .auth()
//       .signInWithPhoneNumber(phone_number, appVerifier)
//       .then((confirmationResult) => {
//         console.log("OTP SEND", confirmationResult);

//         login_form.style.display = "none";
//         otp_form.style.display = "block";

//         window.confirmationResult = confirmationResult;
//       })
//       .catch((error) => {
//         message.style.display = "block";
//         message_value.innerText = error.message;
//       });
//   });

//   otp_form.addEventListener("submit", function (e) {
//     e.preventDefault();
//     let otp_number = otp_form.otp_value.value;

//     window.confirmationResult
//       .confirm(otp_number)
//       .then((result) => {
//         window.location = "/";
//       })
//       .catch((error) => {
//         message.style.display = "block";
//         message_value.innerText = error.message;
//       });
//   });
// }

// // // check if user is logged in or not
// // firebase.auth().onAuthStateChanged(function(user) {
// //     if (user) {
// //         if(window.location.pathname != '/home.html'){
// //             window.location = 'home.html';
// //         }
// //     } else {
// //         if(window.location.pathname === '/home.html'){
// //             window.location = 'index.html';
// //         }
// //     }
// // });

// // if(window.location.pathname != '/home.html'){
// //     // verification captcha setting
// //     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
// //         'size': 'invisible',
// //         'callback': (response) => {
// //             console.log('captcha verified');
// //         }
// //     });
// //     const appVerifier = window.recaptchaVerifier;
// //     firebase.auth().settings.appVerificationDisabledForTesting = true; // turn this off in production stage

// //     // user login
// //     if(form){
// //         form.addEventListener('submit', function(e) {
// //             e.preventDefault();
// //             let phone_number = form.phone.value;

// //             // setup invisible recaptcha
// //             firebase.auth().signInWithPhoneNumber(phone_number, appVerifier)
// //             .then((confirmationResult) => {
// //                 console.log("OTP SEND", confirmationResult);
// //                 form.style.display = 'none';
// //                 otp_form.style.display = 'block';
// //                 window.confirmationResult = confirmationResult;
// //             }).catch((error) => {
// //                 showErrorMessage(error.message);
// //             });

// //         })
// //     }

// //     // verify otp
// //     if(otp_form){
// //         otp_form.addEventListener('submit', function(e) {
// //             e.preventDefault();
// //             let otp_number = otp_form.otp_value.value;
// //             confirmationResult.confirm(otp_number).then((result) => {
// //                 // User signed in successfully.
// //                 const user = result.user;
// //                 window.location = 'home.html';
// //             }).catch((error) => {
// //                 showErrorMessage(error.message);
// //             });
// //         })
// //     }

// // }

// // // show error message function
// // function showErrorMessage(erro_message){
// //     message.style.display = 'block';
// //     message_value.innerText = erro_message;
// //     console.log(erro_message);
// //     setTimeout(function(){
// //         message.style.display = 'none';
// //     }, 3000);
// // }

// // // sign out
// // if(sign_out){
// //     sign_out.addEventListener('click', function(e) {
// //         firebase.auth().signOut().then(() => {
// //             window.location = 'index.html';
// //         }).catch((error) => {
// //         // An error happened.
// //         });
// //     })
// // }

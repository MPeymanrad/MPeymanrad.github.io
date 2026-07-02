let $ = document;
let openSigninModalBtn = $.querySelector(".open_sign_in_modal_button");
let closeSigninModalBtn = $.querySelector(".modal_exit");
let signinModal = $.querySelector(".sign_in_modal");
let overlay = $.querySelector(".overlay");
let signinIndicator = $.querySelector(".is_signed_in");
let waitingOverlay = $.querySelector(".waiting_overlay");


let signinBtn = $.querySelector(".sign_in_button");
let emailInp = $.getElementById("admin_email");
let passInp = $.getElementById("admin_password");

let isLogedIn = false;



const supabaseClient = supabase.createClient("https://jrwnfnxetdyoplkegwge.supabase.co", "sb_publishable_ppGGkiRtxNhecZUBfmjm0Q_Y8goqkgs");


async function signIn() {
    let adminEmail = emailInp.value;
    let adminPassword = passInp.value;
    showWaitIndicator();
    let { data, error } = await supabaseClient.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
    });
    if (error) {
        alert(`An error has been occurred during operation:${error.message}`);
    } else {
        alert("Server Admin Joined!");
        hideWaitIndicator();
        hideSigninModal();
        changeSigninIndicator(true);

    }

}

async function checkSignedIn() {
    showWaitIndicator()
    let { data: { session } } = await supabaseClient.auth.getSession();
    hideWaitIndicator();

    if (session) {
        changeSigninIndicator(true);
        isLogedIn = true;
    } else {
        changeSigninIndicator(false);
    }
}

function showWaitIndicator() {
    waitingOverlay.style.display = "block";
}
function hideWaitIndicator() {
    waitingOverlay.style.display = "none";
}

function showSignInModal() {
    signinModal.classList.add("visible_modal");
    overlay.style.display = "block";
}

function hideSigninModal() {
    signinModal.classList.remove("visible_modal");
    overlay.style.display = "none";
}

function changeSigninIndicator(isSignedin) {
    if (isSignedin) {
        signinIndicator.textContent = "وارد شده به عنوان ادمین:بله";
    } else {
        signinIndicator.textContent = "وارد شده به عنوان ادمین:خیر";

    }
}

openSigninModalBtn.addEventListener("click", () => {
    console.log(isLogedIn);

    if (isLogedIn) {
        alert("Already Logged in.");

    } else {
        showSignInModal();
    }
});
closeSigninModalBtn.addEventListener("click", hideSigninModal);
overlay.addEventListener("click", hideSigninModal);
signinBtn.addEventListener("click", signIn);
checkSignedIn();
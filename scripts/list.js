let $ = document;
let title = $.getElementById("title");
let showAddModalBtn = $.querySelector(".add_btn");
let animalContainer = $.querySelector(".data_container");
let animalInsertSelectedImage = $.querySelector(".bird_image_holder");
let deleteModalExitBtn = $.querySelector(".delete_modal_exit");
let deleteModalTitle = $.querySelector(".ask_delete_title");
let deleteCancelBtn = $.querySelector(".delete_cancel_btn");
let deleteApproveBtn = $.querySelector(".delete_approve_btn");
let exportToExcelBtn = $.querySelector(".export_excel_btn");
let resetInsertAnimalImageBtn = $.getElementById("insert_img_reset");
let animalAddImageInput = $.getElementById("animal_image");
let animalNameInput = $.getElementById("animal_name");
let animalLocationInput = $.getElementById("animal_location");
let animalDateInput = $.getElementById("animal_date");
let animalModalAddBtn = $.getElementById("complete_modal_action_btn");
let searchInput = $.getElementById("animal_search");
let animalUpdateImageInput = $.getElementById("update_img_input");
let animalUpdateSelectedImage = $.getElementById("image_edit_holder");
let resetImageUpdateBtn = $.getElementById("update_img_reset");
let uploadModalCloseBtn = $.getElementById("update_modal_exit");
let editBtn = $.getElementById("edit_modal_action_btn");

let animalModal = $.getElementById("insert_modal");
let editModal = $.getElementById("update_modal");
let overlay = $.querySelector(".overlay");
let waitingOverlay = $.querySelector(".waiting_overlay");
let animalModalExitBtn = $.querySelector(".modal_exit");
let askDeleteModal = $.querySelector(".ask_delete_modal");


let isLogedIn = false;
let animals = [];
let editObj;
let delObj;

const supabaseClient = supabase.createClient("https://jrwnfnxetdyoplkegwge.supabase.co", "sb_publishable_ppGGkiRtxNhecZUBfmjm0Q_Y8goqkgs");



const url = new URL(window.location.href);
const category = url.searchParams.get("category");

async function loadData(category) {
    showWaitIndicator();
    let { data, error } = await supabaseClient.from(category).select();
    if (error) {
        alert(error.message);
    }
    animals = data;
    generateListItems(data);
    hideWaitIndicator();
    loadImages(data);

}
function applySearchTerm(value) {
    animalContainer.innerHTML = "";
    let animalElem;
    animals.forEach(animal => {
        if (animal.name.includes(value)) {
            animalElem = generateListElem(animal);
            animalContainer.appendChild(animalElem);
            loadImages([animal]);
        }
    });
}


function getAnimalImageUrl(bucketName, imgFileName) {
    let { data: imgUrlData } = supabaseClient.storage.from(`${bucketName}Images`).getPublicUrl(imgFileName);
    return imgUrlData.publicUrl;
}
function loadImages(animals) {
    let animalImgElem;
    animals.forEach(function (animal) {
        animalImgElem = $.getElementById(`image_for_${animal.id}`);
        if ((animal.img_file_name === "")) {
            animalImgElem.src = "images/defualt_animal.png";
        }
        else {
            animalImgElem.src = getAnimalImageUrl(category, animal.img_file_name);
        }
    });
}


function generateListItems(animals) {
    animalContainer.innerHTML = "";

    animals.forEach(animal => {
        let animalElem = generateListElem(animal);
        animalContainer.appendChild(animalElem);
    });
}

function generateListElem(animalObj) {
    let animalElem, animalData, animalActions, animalEditBtn, animalDeleteBtn;
    animalElem = $.createElement("div");
    animalElem.classList.add("animal");
    animalElem.dataset.id = animalObj.id;
    animalData = $.createElement("div");
    animalData.classList.add("animal_data");
    animalData.innerHTML = `           
                <img src="images/defualt_animal.png" id=image_for_${animalObj.id}>
                <div class="animal_text_data">
                    <h3 class="animal_name">${animalObj.name}</h3>
                    <h4 class="animal_location">${animalObj.location}</h4>
                    <h4 class="animal_date">${animalObj.date}</h4>
                </div>`
    animalActions = $.createElement("div");
    animalActions.classList.add("animal_actions");
    animalEditBtn = $.createElement("span");
    animalEditBtn.classList.add("animal_edit");
    animalEditBtn.addEventListener("click", () => goToEditMode(animalObj));
    animalEditBtn.innerHTML = `          
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                        class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path
                            d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                    </svg>`;
    animalDeleteBtn = $.createElement("span");
    animalDeleteBtn.classList.add("animal_delete");
    animalDeleteBtn.addEventListener("click", () => askForDeleting(animalObj));
    animalDeleteBtn.innerHTML = `                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                        class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path
                            d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                    </svg>`;
    animalActions.appendChild(animalEditBtn);
    animalActions.appendChild(animalDeleteBtn);

    animalElem.appendChild(animalData);
    animalElem.appendChild(animalActions);
    return animalElem;
}
async function insertAnimal() {
    let newAnimalObj;
    let animalName = animalNameInput.value.trim();
    let animalLocation = animalLocationInput.value.trim();
    let animalDate = animalDateInput.value.trim();
    if (!animalName || !animalLocation || !animalDate) {
        alert("تمام ورودی ها را پر کنید.عکس اختیاریست");
        return;
    }
    showWaitIndicator();
    let finalAnimalImageName = "";
    let animalImageName = animalAddImageInput.files[0] ? animalAddImageInput.files[0].name : "";
    if (animalImageName) {
        let animalImageNameExt = animalImageName.split(".").pop();
        finalAnimalImageName = `${Date.now()}.${animalImageNameExt}`;
        let { data: fileData, error: uploadError } = await supabaseClient.storage.from(category + "Images").upload(finalAnimalImageName, animalAddImageInput.files[0]);
        if (uploadError) {
            alert("Image Upload Error: " + uploadError.message);
            hideWaitIndicator()
            return;
        }
    }

    let { data: insertedAnimalData, error: insertionError } = await supabaseClient.from(category).insert({ name: animalName, location: animalLocation, date: animalDate, img_file_name: finalAnimalImageName }).select();

    hideWaitIndicator();
    if (insertionError) {
        alert("Insertion Error: " + insertionError.message);
        return;
    }

    animalNameInput.value = "";
    animalLocationInput.value = "";
    animalDateInput.value = "";
    animalAddImageInput.value = "";
    animalInsertSelectedImage.src = "images/defualt_animal.png";
    newAnimalObj = { id: insertedAnimalData.id, name: animalName, location: animalLocation, date: animalDate, img_file_name: finalAnimalImageName };
    animals.push(newAnimalObj);
    let newAnimalElem = generateListElem(newAnimalObj);
    animalContainer.appendChild(newAnimalElem);
    loadImages([newAnimalObj]);

}

function showAnimalImagePreview(file, imgElem) {
    let reader = new FileReader();
    reader.onload = (e) => {
        imgElem.src = e.target.result;
    }
    reader.readAsDataURL(file);
}
function resetAnimalImage(modalType) {
    switch (modalType) {
        case "add":
            animalInsertSelectedImage.src = "images/defualt_animal.png";
            animalAddImageInput.value = "";
            break;

        case "edit":
            animalUpdateSelectedImage.src = "images/defualt_animal.png";
            animalUpdateImageInput.value = "";
            break;
        default:
            break;
    }

}
function showWaitIndicator() {
    waitingOverlay.style.display = "block";
}
function hideWaitIndicator() {
    waitingOverlay.style.display = "none";
}
function goToEditMode(animal) {
    if (isLogedIn) {
        editObj = animal;
        let uploadNameInput = $.getElementById("animal_name_update");
        let uploadLocationInput = $.getElementById("animal_location_update");
        let uploadDateInput = $.getElementById("animal_date_update");
        uploadNameInput.value = animal.name;
        uploadLocationInput.value = animal.location;
        uploadDateInput.value = animal.date;
        if (editObj.img_file_name) {

            animalUpdateSelectedImage.src = getAnimalImageUrl(category, animal.img_file_name);
        }
        showModal(editModal, "actions_modal_visible")

    } else {
        alert("You Need To Login For This Action.");
    }
}
function askForDeleting(animal) {
    if (isLogedIn) {
        delObj = animal;
        deleteModalTitle.textContent = `آیا مایل به حذف "${animal.name}" هستید؟`
        showModal(askDeleteModal, "delete_modal_visible");
    } else {
        alert("You Need To Login For This Action.");
    }

}
async function deleteAnimal() {
    hideModal(askDeleteModal, "delete_modal_visible");
    showWaitIndicator();
    let { error: deleteError } = await supabaseClient.from(category).delete().eq('id', delObj.id);
    if (delObj.img_file_name) {
        console.log(delObj.img_file_name);

        let { data, error: imageDeletionError } = await supabaseClient.storage.from(category + "Images").remove([delObj.img_file_name]);
        console.log(data);
        console.log(imageDeletionError);

        if (imageDeletionError) {
            alert("Error While Deleting Image: " + imageDeletionError.message);
            hideWaitIndicator();
            return;
        };
    }
    hideWaitIndicator();
    if (deleteError) {
        alert("Error While Deleting: " + deleteError.message);
        console.log(deleteError);

        return;
    };
    let indexToRemove = animals.findIndex(animal => animal.id === delObj.id);
    animals.splice(indexToRemove, 1);
    let elementToRemove = $.querySelector(`[data-id="${delObj.id}"]`);
    elementToRemove.remove();
}
async function updateAnimal() {
    let updateNameInput = $.getElementById("animal_name_update");
    let updateLocationInput = $.getElementById("animal_location_update");
    let updateDateInput = $.getElementById("animal_date_update");
    let updateNameValue = updateNameInput.value.trim();
    let updateLocationValue = updateLocationInput.value.trim();
    let updateDateValue = updateDateInput.value.trim();
    if (!updateNameValue || !updateLocationValue || !updateDateValue) {
        alert("تمامی سه فیلد متنی را پر کنید");
    }
    showWaitIndicator();
    let animalUpdateImageName = animalUpdateImageInput.files[0] ? animalUpdateImageInput.files[0].name : "";
    let updateImgName;
    if (animalUpdateImageName) {
        await supabaseClient.storage.from(category + "Images").remove([editObj.img_file_name]);
        let updateImgFileExt = animalUpdateImageName.split(".").pop();
        updateImgName = `${Date.now()}.${updateImgFileExt}`;
        let { data, error: updateImageError } = await supabaseClient.storage.from(`${category}Images`).upload(updateImgName, animalUpdateImageInput.files[0]);

        if (updateImageError) {
            alert("Error in updating image: " + updateImageError.message);
            hideWaitIndicator();
            return;
        }
        console.log(data, updateImageError);

    }
    let { error: updateAnimalError } = await supabaseClient.from(category).update({ name: updateNameValue, location: updateLocationValue, date: updateDateValue, img_file_name: updateImgName }).eq("id", editObj.id);

    if (updateAnimalError) {
        alert("Error in updating animal data: " + updateAnimalError.message);
        hideWaitIndicator();

        return;
    }
    let indexToEdit = animals.findIndex(animal => animal.id === editObj.id);
    animals[indexToEdit].name = updateNameValue;
    animals[indexToEdit].location = updateLocationValue;
    animals[indexToEdit].date = updateDateValue;
    animals[indexToEdit].img_file_name = updateImgName;
    let listElemToEdit = $.querySelector(`[data-id="${editObj.id}"]`);
    let listElemImage = listElemToEdit.querySelector("img");
    let listElemName = listElemToEdit.querySelector(".animal_name");
    let listElemLocation = listElemToEdit.querySelector(".animal_location");
    let listElemDate = listElemToEdit.querySelector(".animal_date");
    listElemImage.src = getAnimalImageUrl(category, updateImgName);
    listElemName.textContent = updateNameValue;
    listElemLocation.textContent = updateLocationValue;
    listElemDate.textContent = updateDateValue;




    hideWaitIndicator();
    hideModal(editModal, "actions_modal_visible");

}
async function checkSignedIn() {
    let { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        isLogedIn = true;
    }
}

function checkCategory() {


    switch (category) {
        case "birds":
            title.textContent = "پرندگان مشاهده شده";
            break;
        case "insects":
            title.textContent = "حشرات مشاهده شده";

            break;
        case "plants":
            title.textContent = "گونه های گیاهی مشاهده شده";
        default:
            window.location.href = "../index.html"
    }
}
function exportToExcel() {
    let arrayToExportToExcel = [];
    animals.forEach(animal => {
        arrayToExportToExcel.push({ name: animal.name, location: animal.location, date: animal.date });
    });
    const workSheetToExport = XLSX.utils.json_to_sheet(arrayToExportToExcel);
    const workBookToExport = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBookToExport, workSheetToExport, category);
    XLSX.writeFile(workBookToExport, `${category}.xlsx`, { compression: true });
}
function showModal(modal, visibleClass) {
    modal.classList.add(visibleClass);
    overlay.style.display = "block";

}
function hideModal(modal, visibleClass) {
    modal.classList.remove(visibleClass);
    overlay.style.display = "none";

}

showAddModalBtn.addEventListener("click", function () {
    if (isLogedIn) {
        showModal(animalModal, "actions_modal_visible");
        overlay.style.display = "block";
    } else {
        alert("You need to login for this action.");

    }
});
animalModalExitBtn.addEventListener("click", function () {
    hideModal(animalModal, "actions_modal_visible");
});
uploadModalCloseBtn.addEventListener("click", () => hideModal(editModal, "actions_modal_visible"));
deleteModalExitBtn.addEventListener("click", () => hideModal(askDeleteModal, "delete_modal_visible"));
deleteCancelBtn.addEventListener("click", () => hideModal(askDeleteModal, "delete_modal_visible"));
overlay.addEventListener("click", function () {
    hideModal(animalModal, "actions_modal_visible");
    hideModal(askDeleteModal, "delete_modal_visible");
    hideModal(editModal, "actions_modal_visible");
});
exportToExcelBtn.addEventListener("click", exportToExcel);
window.addEventListener("load", () => {
    checkCategory();
    loadData(category);
    checkSignedIn();
});
animalModalAddBtn.addEventListener("click", insertAnimal);
deleteApproveBtn.addEventListener("click", deleteAnimal);
animalAddImageInput.addEventListener("change", (e) => {
    let file = e.target.files[0];
    if (file) {
        showAnimalImagePreview(file, animalInsertSelectedImage);
    } else {
        resetAnimalImage("add");
    }
});
animalUpdateImageInput.addEventListener("change", (e) => {
    let file = e.target.files[0];
    if (file) {
        showAnimalImagePreview(file, animalUpdateSelectedImage);
    } else {
        resetAnimalImage("edit");
    }
});
editBtn.addEventListener("click", updateAnimal);
resetInsertAnimalImageBtn.addEventListener("click", () => resetAnimalImage("add"));
resetImageUpdateBtn.addEventListener("click", () => resetAnimalImage("edit"));
searchInput.addEventListener("keyup", (e) => applySearchTerm(e.target.value.trim()));
searchInput.addEventListener("change", (e) => applySearchTerm(e.target.value.trim()));

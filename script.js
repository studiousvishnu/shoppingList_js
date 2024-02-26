const input = document.getElementById("inputTask");
const form = document.getElementById("item-form");
const list = document.querySelector(".items");
const clearAll = document.getElementById("btn2");
const Filter = document.getElementById("Filter");
const formBtn = document.getElementById("btn");

let isEditMode = false;

//ADDING ITEMS TO UNORDERED LIST

const onAddItemSubmit = (e) => {
  e.preventDefault();

  const inputData = input.value.trim();
  if (inputData === "") {
    alert("Please enter an item");
    return;
  } else {

    if(isEditMode){
      const itemToEdit = list.querySelector('.edit-mode');
      removeItemFromLocalStorage(itemToEdit.textContent);
      itemToEdit.classList.remove ("edit-mode");
      itemToEdit.remove(); 
      isEditMode = false;
    }
    else{
      if(checkIfItemExist(inputData)){
        alert("This item already exist in the list");
        return;
      }
    }
    addItemToDom(inputData);
    checkUI();
    input.value = "";
    addItemstoLocalStorage(inputData);
  }
};

const addItemstoLocalStorage = (item) => {
  let localStorageItems = getItemsFromStorage();
  localStorageItems.push(item);
  localStorage.setItem("items", JSON.stringify(localStorageItems));
};

const addItemToDom = (inputData) => {
  const newItem = document.createElement("li");
  const boldInput = boldify(inputData);
  newItem.appendChild(boldInput);
  newItem.appendChild(addImg("cross"));
  newItem.className = "field";
  list.appendChild(newItem);
};

const getItemsFromStorage = () => {
  let localStorageItems;
  if (localStorage.getItem("items") === null) {
    localStorageItems = [];
  } else {
    localStorageItems = JSON.parse(localStorage.getItem("items"));
  }
  return localStorageItems;
};



const displayItems = () => {
  const localStorageItems = getItemsFromStorage();
  localStorageItems.forEach((item) => {
    addItemToDom(item);
  })
  checkUI();
}
const boldify = (text) => {
  const bold = document.createElement("b");
  bold.appendChild(document.createTextNode(text));
  return bold;
};

const addImg = (classes) => {
  const img = document.createElement("img");
  img.className = classes;
  img.src = "./images/cross-mark.svg";
  return img;
};

//removing single items
const onClickItem = (e) => {
  if (e.target.classList.contains("cross")){
    removeItem(e.target.parentElement);

  }
  else{
    setItemtoEdit(e.target);
  }
}

const setItemtoEdit = (item) => {
  isEditMode = true;

  const clickedLi = item.closest('li');

  if (clickedLi && !clickedLi.classList.contains('edit-mode')) {
    list.querySelectorAll('li').forEach((element) => {
      element.classList.remove('edit-mode');
    });

    clickedLi.classList.add('edit-mode');
    formBtn.innerHTML = "edit Item";
    formBtn.style.color = "aqua";
    formBtn.style.background = "grey";
    input.value = clickedLi.querySelector('b').textContent;
  }
}


const removeItem = (item) => {
  
    if (confirm("Are you sure you want to remove this item form the list?"))
      item.remove();

      removeItemFromLocalStorage(item.textContent);
  
  checkUI();
};

const removeItemFromLocalStorage = (item) => {
  let localStorageItems = getItemsFromStorage();
  localStorageItems = localStorageItems.filter(element => element !== item);
  localStorage.setItem("items", JSON.stringify(localStorageItems));
};


//removing all items

const onClear = () => {
  if (confirm("Are you sure you want to clear the list?")) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    localStorage.removeItem("items");
    
    checkUI();
  }
};

const checkUI = () => {
  input.value=""; 
  const listItems = list.querySelectorAll("li");
  if (listItems.length === 0) {
    clearAll.style.display = "none";
    Filter.style.display = "none";
  } else {
    clearAll.style.display = "block";
    Filter.style.display = "block";
  }


  formBtn.innerHTML ="+ Add item";
  formBtn.style.background ="green";
  formBtn.style.color ="white";
  
  isEditMode= false;
};
checkUI();

const onFilter = (e) => {
  const listItems = list.querySelectorAll("li");
  const input = e.target.value.toLowerCase();

  listItems.forEach((element) => {
    const itemName = element.textContent.toLowerCase();
    if (itemName.indexOf(input) !== -1) {
      element.style.display = "flex";
    } else {
      element.style.display = "none";
    }
  });
};


const checkIfItemExist = (item)=>{
  const itemsFromStorage =getItemsFromStorage();
  if(itemsFromStorage.includes(item)){
    return true;
  }
  else{
    return false;
  }
}
const init=()=>{
  form.addEventListener("submit", onAddItemSubmit);
list.addEventListener("click", onClickItem);
clearAll.addEventListener("click", onClear);
Filter.addEventListener("input", onFilter);


document.addEventListener("DOMContentLoaded",displayItems);

}

init();
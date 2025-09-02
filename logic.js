import {emptyItem,Item, classify} from './item.js'
import { getSlotClassification, Slots, addItem, removeItem, StandardSlots} from './slots.js';
import { uploadImage, uploadImageToStandard } from './utils.js';

//global values for the slots
export let smallSlots  = new Slots(0), mediumSlots  = new Slots(0), largeSlots = new Slots(0), 
tinySlots = new Slots(0), standardSlots = new StandardSlots(5)


//global value for strength modifier
let strengthModifier = 0
let playerName = ""

//global value for current referenced item for a file change
export var imageReference = null
export var itemReference = null

//set imageReference function
export function setImageReference(reference){
    imageReference = reference
}

export function setItemReference(reference){
    itemReference = reference
}


//function to give max slots here
//hardcoded
function calculateSlots(){
    //edge cases
    let smallSlotsSize = 0, mediumSlotsSize = 0, largeSlotsSize = 0

    if (strengthModifier == -1){
        smallSlotsSize = 4, mediumSlotsSize = 1 //4 small slots, 1 medium slot
    }
    else if (strengthModifier < -1 && strengthModifier >= -5){
        smallSlotsSize = 5 + (strengthModifier)
    }
    else {
        smallSlotsSize = 5 + (strengthModifier * 5)
        mediumSlotsSize = 3 + (strengthModifier * 2)
        largeSlotsSize = 1 + ((Math.floor(strengthModifier/2) * 1)) 
    }

    //change max sizes of the different slots
    smallSlots.maxSize = smallSlotsSize
    mediumSlots.maxSize = mediumSlotsSize
    largeSlots.maxSize = largeSlotsSize
    tinySlots.maxSize = 200 //change this if needed

    console.log(largeSlots.items)

}

//loads the json file
function loadJson(event){
    const file = event.target.files[0]
    if (!file){
        console.log("file not loaded properly lol")
        return
    }    

    //creates an instance of a reader using the FileReader API
    const reader = new FileReader() 

    //when the reader loads everything, the loadAll function starts workin.
    reader.onload = async function(event) {
        try {
            console.log("shit was loaded goated")
            const jsonData = JSON.parse(event.target.result)
            await loadAll(jsonData) 
        } 
        catch (error) {
            console.error("Invalid JSON file", error)
        }
    }

    //reads the text file then passes it onto reader.onload when its done reading 
    reader.readAsText(file)

}

//loads the items and sends them into the classification function
async function loadAll(jsonFile){
    try {
        console.log("items are now being loaded into the different slots")

        //inputs the player name and strength modifier
        playerName = jsonFile.player.name
        console.log("Json player name is:" + jsonFile.player.name)
        console.log("Player name is:" + playerName)
        strengthModifier = jsonFile.player.strengthModifier
        console.log("strength modifier is" + strengthModifier)
        console.log("json strength modifier is " + jsonFile.player.strengthModifier)

        
        document.getElementById("playerName").innerText = playerName
        if (strengthModifier < 0){
            document.getElementById("strengthModifierDisplay").innerText = (strengthModifier)
        }
        else {
            document.getElementById("strengthModifierDisplay").innerText = ("+" + strengthModifier)
        }


        //clears the slots
        clearSlots()

        //calculates current slots
        calculateSlots()

        if (jsonFile.player.rangedWeaponFlag == false){
            smallSlots.maxSize += 2
        }

        //populates standard slots
        loadStandard(jsonFile)

        //populates item slots
        loadItems(jsonFile)
        
        //renders all menus
        standardSlots.renderStandardSlots("standardSlots")
        largeSlots.renderAllItems("large-Slots")
        mediumSlots.renderAllItems("medium-Slots")
        smallSlots.renderAllItems("small-Slots")
        tinySlots.renderAllItems("tiny-Slots")
    }
    catch(error){
        console.log("error reading file gng", error)
    }
}

function loadItems(jsonFile){
    //could be optimized but ong who cares
    jsonFile.items.largeSlots.forEach(obj => {
        const newItem = new Item(obj.image, obj.name, obj.classification, obj.description)
        largeSlots.items.push(newItem)
        newItem.id = largeSlots.currentSize
        largeSlots.currentSize++
    })
    jsonFile.items.mediumSlots.forEach(obj => {
        const newItem = new Item(obj.image, obj.name, obj.classification, obj.description)
        mediumSlots.items.push(newItem)
        newItem.id = mediumSlots.currentSize
        mediumSlots.currentSize++
    })
    jsonFile.items.smallSlots.forEach(obj => {
        const newItem = new Item(obj.image, obj.name, obj.classification, obj.description)
        smallSlots.items.push(newItem)
        newItem.id = smallSlots.currentSize
        smallSlots.currentSize++
    })
    jsonFile.items.tinySlots.forEach(obj => {
        const newItem = new Item(obj.image, obj.name, obj.classification, obj.description)
        tinySlots.items.push(newItem)
        newItem.id = tinySlots.currentSize
        tinySlots.currentSize++
    })
}

function loadStandard(jsonFile){
    standardSlots.armorSlot = jsonFile.standardSlots.armorSlot
    standardSlots.helmetSlot = jsonFile.standardSlots.helmetSlot 
    standardSlots.mainHand = jsonFile.standardSlots.mainHand
    standardSlots.offHand = jsonFile.standardSlots.offHand
    standardSlots.rangedWeapon = jsonFile.standardSlots.rangedWeapon
    standardSlots.backpack = jsonFile.standardSlots.backpack
    standardSlots.twoHandedFlag = jsonFile.standardSlots.twoHandedFlag
    standardSlots.rangedWeaponFlag = jsonFile.standardSlots.rangedWeaponFlag
    standardSlots.miscArmorSize = 0
    jsonFile.standardSlots.miscArmor.forEach(obj => {
        const newItem = new Item(obj.image, obj.name, obj.classification, obj.description)
        standardSlots.miscArmor.push(newItem)
        newItem.id = standardSlots.miscArmorSize
        console.log(newItem)
        standardSlots.miscArmorSize++
    })
}

function clearSlots(){
    //update this to clear standard slots
    largeSlots.items = []
    largeSlots.currentSize = 0
    mediumSlots.items = []
    mediumSlots.currentSize = 0
    smallSlots.items = []
    smallSlots.currentSize = 0
    tinySlots.items = []
    tinySlots.currentSize = 0
    clearStandardSlots()
    derenderSlots()
}

function derenderSlots(){
    //update this to clear standard slots
    document.getElementById("standard-Slots").innerHTML = '<img src = "container-assets/standard_slots.png" class = "container-label">'
    document.getElementById("large-Slots").innerHTML = '<img src = "container-assets/large_slots.png" class = "container-label">' 
    document.getElementById("medium-Slots").innerHTML = '<img src = "container-assets/medium_slots.png" class = "container-label">' 
    document.getElementById("small-Slots").innerHTML = '<img src = "container-assets/small_slots.png" class = "container-label">' 
    document.getElementById("tiny-Slots").innerHTML = '<img src = "container-assets/tiny_slots.png" class = "container-label">' 
}

function clearStandardSlots(){
    standardSlots.armorSlot = emptyItem
    standardSlots.helmetSlot = emptyItem
    standardSlots.mainHand = emptyItem
    standardSlots.offHand = emptyItem
    standardSlots.rangedWeapon = emptyItem
    standardSlots.backpack = emptyItem
    standardSlots.twoHandedFlag = false
    standardSlots.rangedWeaponFlag = false
    standardSlots.miscArmor = []
    standardSlots.miscArmorSize = 0
}


//function to save json file
function saveAsJson(){
    //get the data to save
    let largeItems = largeSlots.items
    let mediumItems = mediumSlots.items
    let smallItems = smallSlots.items
    let tinyItems = tinySlots.items
    
    const saveData = {
        player: {name: playerName, strengthModifier},
        standardSlots, 
        items: {
        largeSlots: largeItems,
        mediumSlots: mediumItems,
        smallSlots: smallItems,
        tinySlots: tinyItems}
    }
    
    //turns it into a JSON formatted string
    const jsonData = JSON.stringify(saveData, null, 5)

    const blob = new Blob([jsonData], {
        type : "application/json"
    })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'saveData.json'
    link.click()
}

export function saveToStorage(){
    //get the data to save
    let largeItems = largeSlots.items
    let mediumItems = mediumSlots.items
    let smallItems = smallSlots.items
    let tinyItems = tinySlots.items

    //saves all the json stuff
    const saveData = {
        player: {name: playerName, strengthModifier},
        standardSlots, 
        items: {
        largeSlots: largeItems,
        mediumSlots: mediumItems,
        smallSlots: smallItems,
        tinySlots: tinyItems}
    }

    //saves it into the local storage
    localStorage.setItem("saveData",JSON.stringify(saveData))
}

//loading from storage
function loadFromStorage(){
    const loadData = JSON.parse(localStorage.getItem("saveData"))
    loadAll(loadData)
}

//Fetches the mapping of the icon data
function fetchIconData(){
    return fetch("icon_data.json")
        .then(res => res.json())
        .catch(err => {
            console.error("failed to load data", err)
            return []
        })
}


function renderGrid(iconList){
    const gridContainer = document.getElementById("iconGrid")

    let iconNavBar = document.getElementById("iconNavBar") //navigation bar of the different tabs
    
    Object.keys(iconList).forEach(category => {

        let iconCategory = document.createElement("button")
        iconCategory.innerText = category
        iconCategory.classList.add("tablinks")
        console.log(category)
        iconCategory.onclick = function(event){
            openCategory(event, category)
        }
        iconNavBar.appendChild(iconCategory)

        let iconCategoryDiv = document.createElement("div")
        iconCategoryDiv.id = category //make the id the category name
        iconCategoryDiv.classList.add("icon-category-div", "tabcontent")

        let iconContainer = document.createElement("div")
        iconContainer.id = category
        iconContainer.classList.add("icon-category-container")
        iconCategoryDiv.appendChild(iconContainer)

        
        gridContainer.appendChild(iconCategoryDiv)

        const itemIcons = iconList[category]

        renderCategory(itemIcons, iconContainer)

    })
    
}

function renderCategory(itemIcons, iconCategoryDiv){
    itemIcons.forEach(icon => {
        let img = document.createElement("img")
        img.src = icon.filename
        img.title = icon.item_name
        img.alt = icon.item_name
        img.loading = "lazy"
        img.classList.add("item-icon")
        iconCategoryDiv.appendChild(img)
    })
}

export function replaceImage(){
    return new Promise((resolve, reject) => {
        let modal = document.getElementById("iconGridModal");
        modal.style.display = "block";

        function onIconClick(event) {
            if (event.target.classList.contains("item-icon")) {
                modal.removeEventListener("click", onIconClick)
                closeIconMenu()
                resolve(event.target.src) //returns this as the result of the promise
            }
        }

        modal.addEventListener("click", onIconClick)

        //so that the window click stuff isn't overwritten
        function onWindowClick(event) {
            if (event.target == modal) {
                modal.removeEventListener("click", onIconClick);
                window.removeEventListener("click", onWindowClick)
                modal.style.display = "none";
                reject("cancelled"); //cancelles
            }
        }
        window.addEventListener("click", onWindowClick)
    })
    
}



function openCategory(evt, categoryName){
    var i, tabcontent, tablinks

    tabcontent = document.getElementsByClassName("tabcontent")
    for (i=0; i<tabcontent.length; i++){
        tabcontent[i].style.display = "none"
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");}

    console.log(categoryName)
    document.getElementById(categoryName).style.display = "flex";
    evt.currentTarget.className += " active";
}    

//for save items
function getContainerID(classification){
    //function to map classification to containerID name here
    const containerMap = {
        "small": "small-Slots",
        "medium": "medium-Slots",
        "large": "large-Slots",
        "tiny": "tiny-Slots",
    }
    return containerMap[classification] || null    
}

//for use in remove Item
export function getClassificationfromContainerID(containerID){
    const containerMap = {
        "small-Slots": "small",
        "medium-Slots": "medium",
        "large-Slots": "large",
        "tiny-Slots": "tiny",
    }
    return containerMap[containerID] || null
}

//for use in classify and save Item
export function getSlotsfromContainerID(containerID){
    const containerMap = {
        "small-Slots": smallSlots,
        "medium-Slots": mediumSlots,
        "large-Slots": largeSlots,
        "tiny-Slots": tinySlots,
    }
    return containerMap[containerID] || null    
}

//unhides all removavle items
function toggleRemoveItems(){ //gets all elements that are remove-able
    let hiddenElements = document.querySelectorAll(".remove-element")
    console.log("found hidden elements:", hiddenElements)
    hiddenElements.forEach(element => {
        element.classList.toggle("hidden")
    })
}

//initialize these slots in an array
let slotArray = document.querySelectorAll(".item-container")
let arrayPointer = 0


document.getElementById("addItem").addEventListener("click", addItem)
document.getElementById("removeItemBtn").addEventListener("click", toggleRemoveItems)

document.getElementById("confirmRemove").addEventListener("click", function(){
    removeItem()
    toggleRemoveItems()
})

//listen for the save item command
document.getElementById("saveItem").addEventListener("click", function(){
    console.log("Save Item Pressed") 
    let renderLocation = ""
    let newItem = new Item(imageReference, itemName.value, itemClassification.value, itemDescription.value)
    console.log("new item's classification is" + newItem.classification)
    if (newItem.classification == "misc") {
        let MiscItem = newItem
        MiscItem.id = standardSlots.miscArmorSize
        try{
            standardSlots.miscArmor.push(MiscItem)
            standardSlots.miscArmorSize++
        }
        catch{
            console.error("Not able to append")
        }

        //generation works. rendering Last doesn't. id doesn't

        standardSlots.renderLastMisc()
        //saveToStorage()        
    }

    else {
        try {
            renderLocation = classify(newItem)
        } catch(error) {
            console.error("Inventory is Full")
            return
        }
        //it needs to get the classification of where the item was placed
        let slot = getSlotsfromContainerID(renderLocation)    
        //change this, create a map that makes it so that 
        
        if (slot) {
            slot.renderLastItem(renderLocation)
        }
        else {
            console.error("Invalid Classification", newItem.classification)
        }

    }  
    saveToStorage()

    //clear the fields
    document.getElementById("itemName").value = ""
    document.getElementById("itemDescription").value = ""
    document.getElementById("itemClassification").selectedIndex = 0

    //close the menu
    document.getElementById("itemAddModal").style.display = "none"

    //resets the image after
    imageReference = null
    document.getElementById("addItemImage").src = "empty_icons/item.png"



})

//event listener for opening the replace image menu in addItem
document.getElementById("addItemImageLabel").addEventListener("click", async function(){
    try {
        const selectedIcon = await replaceImage();
        imageReference = selectedIcon;
        document.getElementById("addItemImage").src = selectedIcon;
        saveToStorage();
    } catch (e) {
        // User cancelled or closed modal
        console.log("Icon selection cancelled");
    }
})

//event listeners for the page
document.getElementById("cycleLeft").addEventListener("click", function(){
    console.log(arrayPointer)
    if (arrayPointer > 0){
        slotArray[arrayPointer].classList.toggle("hidden")
        arrayPointer--
        slotArray[arrayPointer].classList.toggle("hidden")
    }
    else {
        slotArray[arrayPointer].classList.toggle("hidden")
        arrayPointer = 4
        slotArray[arrayPointer].classList.toggle("hidden")
    }
    console.log(arrayPointer)
})

document.getElementById("cycleRight").addEventListener("click", function(){
    console.log(arrayPointer)
    if (arrayPointer < 4){
        slotArray[arrayPointer].classList.toggle("hidden")
        arrayPointer++
        slotArray[arrayPointer].classList.toggle("hidden")
    }
    else {
        slotArray[arrayPointer].classList.toggle("hidden")
        arrayPointer = 0
        slotArray[arrayPointer].classList.toggle("hidden")
    }
    console.log(arrayPointer)
})

document.getElementById("newInventory").addEventListener("click", function(){
    console.log("New inventory pressed")
    let modal = document.getElementById("initializeMenuModal")
    modal.style.display = "block"
    let settingsModal = document.getElementById("settingsMenuModal")
    settingsModal.style.display = "none"

    window.onclick = function(event) { //closes if you touch outside the content in the shaded region
        if (event.target == modal) {
            modal.style.display = "none"
        }
    }

})

document.getElementById("jsonInput").addEventListener("change", function(event){
    loadJson(event)
    document.getElementById("initializeMenuModal").style.display = "none"
})

document.getElementById("newInventorySubmit").addEventListener("click", function(event){
    event.preventDefault()
    console.log(playerName)
    console.log(strengthModifier)

    if(!document.getElementById("characterName").value){
        alert("Please enter a character name")
        return
    }
    if(!document.getElementById("strengthModifier").value){
        alert("Please enter a strength modifier")
        return
    }

    playerName = document.getElementById("characterName").value
    strengthModifier = document.getElementById("strengthModifier").value

    console.log("logging char name")
    console.log(document.getElementById("characterName").value)

    if (playerName != "" && strengthModifier != "") {
        console.log("clearing slots")
        console.log(playerName)
        console.log(strengthModifier)
    
        clearSlots()
    }

    console.log(playerName)
    console.log(strengthModifier)

    document.getElementById("playerName").innerText = playerName
    if (strengthModifier < 0){
        document.getElementById("strengthModifierDisplay").innerText = strengthModifier
    }
    else {
        document.getElementById("strengthModifierDisplay").innerText = ("+" + strengthModifier)
    }


    document.getElementById("initializeMenuModal").style.display = "none"
    calculateSlots()
    updateCounter("largeSlotCounter")
    updateCounter("mediumSlotCounter")
    updateCounter("smallSlotCounter")
    console.log(smallSlots.maxSize, mediumSlots.maxSize, largeSlots.maxSize)
    standardSlots.renderStandardSlots()
})

document.getElementById("saveJson").addEventListener("click", function(){
    saveAsJson()
})


document.addEventListener("DOMContentLoaded", function() {
    fetchIconData().then(iconData => {
        renderGrid(iconData)
    })


    loadFromStorage()

    initializeCounters()
})

//  to do: fix ts
export function updateCounter(counterID){
    let counter = document.getElementById(counterID)
    if (counterID == "largeSlotCounter"){
        counter.innerText = largeSlots.maxSize - largeSlots.currentSize
        //if inner text is 0, shade it? or make it red?
    }
    else if (counterID == "mediumSlotCounter"){
        counter.innerText = mediumSlots.maxSize - mediumSlots.currentSize
    }
    else if (counterID == "smallSlotCounter"){
        counter.innerText = smallSlots.maxSize - smallSlots.currentSize
    }
}

function initializeCounters(){
    let largeCounter = document.getElementById("largeSlotCounter")
    let mediumCounter = document.getElementById("mediumSlotCounter")
    let smallCounter = document.getElementById("smallSlotCounter")

    largeCounter.innerText = largeSlots.maxSize - largeSlots.currentSize
    mediumCounter.innerText = mediumSlots.maxSize - mediumSlots.currentSize
    smallCounter.innerText = smallSlots.maxSize - smallSlots.currentSize
}

document.getElementById("settingsButton").addEventListener("click", function(){
    let modal = document.getElementById("settingsMenuModal")
    modal.style.display = "block"

    window.onclick = function(event) { //closes if you touch outside the modal
        if (event.target == modal) {
        modal.style.display = "none"
        }
    }
})

document.getElementById("closeSettings").addEventListener("click", function(){
    let modal = document.getElementById("settingsMenuModal")
    modal.style.display = "none"
})

document.getElementById("strengthModifierDisplay").addEventListener("blur", () => {
    console.log("Strength Modifier changed")
    strengthModifier = parseInt(document.getElementById("strengthModifierDisplay").innerText)
    if (strengthModifier < 0){
        document.getElementById("strengthModifierDisplay").innerText = strengthModifier
    }
    else {
        document.getElementById("strengthModifierDisplay").innerText = ("+" + strengthModifier)
    }

    calculateSlots()
    updateCounter("largeSlotCounter")
    updateCounter("mediumSlotCounter")
    updateCounter("smallSlotCounter")
    saveToStorage()
})

document.getElementById("saveMisc").addEventListener("click", () => {
    standardSlots.saveMiscItem()
})

document.getElementById("testGrid").addEventListener("click", function(){
    let modal = document.getElementById("iconGridModal")
    modal.style.display = "block"

    window.onclick = function(event) { //closes if you touch outside the modal
        if (event.target == modal) {
        modal.style.display = "none"
    }}
})

function openIconMenu() {
    let modal = document.getElementById("iconGridModal")
    modal.style.display = "block"

    window.onclick = function(event) { //closes if you touch outside the modal
        if (event.target == modal) {
        modal.style.display = "none"
    }}    
}

function closeIconMenu() {
    let modal = document.getElementById("iconGridModal")
    modal.style.display = "none"
}


//listeners for opening and closing from localstorage

//minimum viable product:

//FUNCTIONS NEEDED:
//OPTIMIZE JSON
//SAVE JSON
//SAVE TO LOCAL STORAGE
//CSS
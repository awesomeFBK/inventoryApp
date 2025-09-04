import { CoinPouch,emptyItem, Item } from "./item.js"
import { 
    smallSlots, 
    mediumSlots, 
    largeSlots, 
    tinySlots, 
    updateCounter, 
    saveToStorage, 
    getClassificationfromContainerID,
    replaceImage, 
    imageReference,
    setImageReference} from "./logic.js"
import { uploadImage, uploadImageToStandard } from './utils.js';

//helper function to map classifications to inventory slots
export function getSlotClassification(classification){
    const slotMap = {
        "small": smallSlots,
        "medium": mediumSlots,
        "large": largeSlots,
        "tiny": tinySlots,
    }
    return slotMap[classification] || null
}

export class Slots{
    constructor(maxSize) {
        this.maxSize = maxSize
        this.currentSize = 0
        this.items = []
    }

    renderAllItems(containerID){
        this.items.forEach(item => item.renderItem(containerID)) //adds em all
    }
    
    renderLastItem(containerID){
        console.log("Rendering last item appended")
        let lastItem = this.items[this.items.length - 1] //gets the index of the last item in this slot
        lastItem.renderItem(containerID) //renders it

    }

}

export class StandardSlots extends Slots{
    constructor(){
        super(0) //run the max size as 0
        this.armorSlot = emptyItem
        this.helmetSlot = emptyItem
        this.mainHand = emptyItem
        this.offHand = emptyItem
        this.rangedWeapon = emptyItem
        this.backpack = emptyItem
        this.rangedWeaponFlag = true //if you are using a ranged weapon or converting it into two small slots
        this.twoHandedFlag = false //if you are using two hands
        this.miscArmor = [] //for miscallaneous enchanted items
        this.miscArmorSize = 0 //for tracking how many enchanted items are there
    }

    renderStandardSlots(){
        //create the slots
        let itemDiv = document.createElement("div")//create the div that holds the data
        itemDiv.classList.add("item-div")

        //HELMET SLOT

        let helmetDiv = document.createElement("div")
            helmetDiv.innerHTML = "<p>Helmet</p>"
            let helmetImg = document.createElement("img")
            helmetImg.src = this.helmetSlot.image || "empty_icons/helmet.png"
            helmetImg.classList.add("equipment-slot-image")
            
            let helmetFileInput = document.createElement("input")
            helmetFileInput.style.display = "none" // Hide the file input

            let helmetLabel = document.createElement("label")
            helmetLabel.appendChild(helmetImg)
            helmetLabel.appendChild(helmetFileInput)
            helmetDiv.appendChild(helmetLabel)

            helmetFileInput.addEventListener("click", async (event) => {
                try {
                    const selectedIcon = await replaceImage();
                    helmetImg.src = selectedIcon;
                    this.helmetSlot.image = selectedIcon;
                    saveToStorage();
                } catch (e) {
                    // User cancelled or closed modal
                    console.log("Icon selection cancelled");
                }
            })

            let helmetName = document.createElement("p")
            helmetName.innerText = this.helmetSlot.name || "Helmet"
            helmetName.contentEditable = "true"
            helmetDiv.appendChild(helmetName)

            helmetName.addEventListener("blur", () => {
                if (helmetName.innerText.trim() === ""){
                    helmetName.innerText = "Helmet"
                }
                this.helmetSlot.name = helmetName.innerText; // Update the object
                saveToStorage()
            });
            
            let helmetDescription = document.createElement("p")
            helmetDescription.innerText = this.helmetSlot.description || "Description"
            helmetDescription.contentEditable = "true"
            helmetDiv.appendChild(helmetDescription)
            
            helmetDescription.addEventListener("blur", () => {
                if (helmetDescription.innerText.trim() === ""){
                    helmetDescription.innerText = "Description"
                }
                this.helmetSlot.description = helmetDescription.innerText; // Update the object
                saveToStorage()
            });
        
        //ARMOR SLOT

        let armorDiv = document.createElement("div")
            armorDiv.innerHTML = "<p>Armor</p>"
            //image element
            let armorImg = document.createElement("img")
            armorImg.src = this.armorSlot.image || "empty_icons/armor.png"
            armorImg.classList.add("equipment-slot-image")

            //file input
            let armorFileInput = document.createElement("button")
            armorFileInput.style.display = "none" // Hide the file input

            //associaties both as a label
            let armorLabel = document.createElement("label")
            armorLabel.appendChild(armorImg)
            armorLabel.appendChild(armorFileInput)
            armorDiv.appendChild(armorLabel)

            //event listener for hte file input
            armorFileInput.addEventListener("click", async (event) => {
                try {
                    const selectedIcon = await replaceImage();
                    armorImg.src = selectedIcon;
                    this.armorSlot.image = selectedIcon;
                    saveToStorage();
                } catch (e) {
                    // User cancelled or closed modal
                    console.log("Icon selection cancelled");
                }
            })

            //appends the armor name to the div
            let armorName = document.createElement("p")
            armorName.contentEditable = "true"
            armorName.innerText = this.armorSlot.name || "Armor Slot"
            armorDiv.appendChild(armorName)
        
            // Save changes to localStorage when content is edited
            armorName.addEventListener("blur", () => {
                if (armorName.innerText.trim() === ""){
                    armorName.innerText = "Armor Slot"
                }
                this.armorSlot.name = armorName.innerText; // Update the object
                saveToStorage()
            });

            //appends armor description to the div
            let armorDescription = document.createElement("p")
            armorDescription.innerText = this.armorSlot.description || "Description"
            armorDescription.contentEditable = "true"
            armorDiv.appendChild(armorDescription)

            // Save changes to localStorage when content is edited
            armorDescription.addEventListener("blur", () => {
                if (armorDescription.innerText.trim() === ""){
                    armorDescription.innerText = "Description"
                }
                this.armorSlot.description = armorDescription.innerText; // Update the object
                saveToStorage()
            });

        //MAIN HAND SLOT

        let mainHandDiv = document.createElement("div")
            mainHandDiv.innerHTML = "<p>Main Hand</p>"
            let mainHandImg = document.createElement("img")
            mainHandImg.src = this.mainHand.image || ("empty_icons/sword.png")
            mainHandImg.classList.add("equipment-slot-image")

            let mainHandFileInput = document.createElement("button")
            mainHandFileInput.style.display = "none" // Hide the file input

            let mainHandLabel = document.createElement("label")
            mainHandLabel.appendChild(mainHandImg)
            mainHandLabel.appendChild(mainHandFileInput)
            mainHandDiv.appendChild(mainHandLabel)

            //event listener for hte file input
            mainHandFileInput.addEventListener("click", async (event) => {
                try {
                    const selectedIcon = await replaceImage();
                    mainHandImg.src = selectedIcon;
                    this.mainHand.image = selectedIcon;
                    saveToStorage();
                } catch (e) {
                    // User cancelled or closed modal
                    console.log("Icon selection cancelled");
                }
            })

            //appends the main hand div
            let mainName = document.createElement("p")
            mainName.innerText = this.mainHand.name || "Main Hand"
            mainHandDiv.appendChild(mainName)
            mainName.contentEditable = "true"

            // Save changes to localStorage when content is edited
            mainName.addEventListener("blur", () => {
                if (mainName.innerText.trim() === ""){
                    mainName.innerText = "Main Hand"
                }
                this.mainHand.name = mainName.innerText; // Update the object
                saveToStorage()
            });

            //appends description to main hand div
            let mainDescription = document.createElement("p")
            mainDescription.innerText = this.mainHand.description || "Description"
            mainHandDiv.appendChild(mainDescription)        
            mainDescription.contentEditable = "true"
            
            // Save changes to localStorage when content is edited
            mainDescription.addEventListener("blur", () => {
                if (mainDescription.innerText.trim() === ""){
                    mainDescription.innerText = "Description"
                }
                this.mainHand.description = mainDescription.innerText;
                saveToStorage() // Update the object
            })


        let offHandDiv = document.createElement("div")
            offHandDiv.innerHTML = "<p>Off Hand</p>"
            let offHandImg = document.createElement("img")
            offHandImg.src = this.offHand.image || ("empty_icons/shield.png")
            offHandImg.classList.add("equipment-slot-image")
            
            let offHandFileInput = document.createElement("button")
            offHandFileInput.style.display = "none" // Hide the file input

            //associates both as a label
            let offHandLabel = document.createElement("label")
            offHandLabel.appendChild(offHandImg)
            offHandLabel.appendChild(offHandFileInput)
            offHandDiv.appendChild(offHandLabel)

            //event listener for hte file input
            offHandFileInput.addEventListener("click", async (event) => {
                try {
                    const selectedIcon = await replaceImage();
                    offHandImg.src = selectedIcon;
                    this.offHand.image = selectedIcon;
                    saveToStorage();
                } catch (e) {
                    // User cancelled or closed modal
                    console.log("Icon selection cancelled");
                }
            })

            //appends the armor name to the div
            let offHandName = document.createElement("p")
            let offHandDescription = document.createElement("p")
            offHandName.contentEditable = "true"
            offHandDescription.contentEditable = "true"

            offHandName.innerText = this.offHand.name || "Off Hand"
            offHandDescription.innerText = this.offHand.description || "Description"
            offHandDiv.appendChild(offHandName)
            offHandDiv.appendChild(offHandDescription)

            //adds an overlay on top 
            let offHandOverlay = document.createElement("div")
            offHandOverlay.id = "offHandOverlay"
            offHandOverlay.classList.add("slot-overlay")
            offHandDiv.appendChild(offHandOverlay)

            //used overlay
            let offHandUsed = document.createElement("div")
            offHandUsed.id = "offHandUsed"
            offHandUsed.classList.add("slot-used")
            offHandOverlay.appendChild(offHandUsed)

            //adds an image on top of the overlay
            let offHandUsedLabel = document.createElement("img")
            offHandUsedLabel.src = "overlay.png"
            offHandUsedLabel.classList.add("slot-used-label")
            offHandUsedLabel.id = "offHandUsedLabel"
            offHandDiv.append(offHandUsedLabel)

            // Save changes to localStorage when content is edited
            offHandName.addEventListener("blur", () => {
                if (offHandName.innerText.trim() === ""){
                    offHandName.innerText = "Description"
                }
                this.offHand.name = offHandName.innerText;
                saveToStorage() // Update the object
            })            

            // Save changes to localStorage when content is edited
            offHandDescription.addEventListener("blur", () => {
                if (offHandDescription.innerText.trim() === ""){
                    offHandDescription.innerText = "Description"
                }
                this.offHand.description = offHandDescription.innerText;
                saveToStorage() // Update the object
            })            

            console.log("this.twoHandedFlag Value is ", this.twoHandedFlag)

            if (this.twoHandedFlag == true) {
                offHandUsed.classList.remove("hidden")
                offHandUsedLabel.classList.remove("hidden")
            }

        //RANGED WEAPON SLOT

        let rangedDiv = document.createElement("div")
            rangedDiv.innerHTML = "<p>Ranged Weapon</p>"
            let rangedDivImg = document.createElement("img")
            rangedDivImg.src = this.rangedWeapon.image || ("empty_icons/ranged.png")
            rangedDivImg.classList.add("equipment-slot-image")
            
            let rangedFileInput = document.createElement("button")
            rangedFileInput.style.display = "none" // Hide the file input

            //associates both as a label
            let rangedLabel = document.createElement("label")
            rangedLabel.appendChild(rangedDivImg)
            rangedLabel.appendChild(rangedFileInput)
            rangedDiv.appendChild(rangedLabel)

            //event listener for hte file input
            rangedFileInput.addEventListener("click", async (event) => {
                try {
                    const selectedIcon = await replaceImage();
                    rangedDivImg.src = selectedIcon;
                    this.rangedWeapon.image = selectedIcon;
                    saveToStorage();
                } catch (e) {
                    // User cancelled or closed modal
                    console.log("Icon selection cancelled");
                }
            })

            //appends the armor name to the div
            let rangedName = document.createElement("p")
            let rangedDescription = document.createElement("p")
            rangedName.contentEditable = "true"
            rangedDescription.contentEditable = "true"

            rangedName.innerText = this.rangedWeapon.name || "Ranged Weapon"
            rangedDescription.innerText = this.rangedWeapon.description || "Description"

            rangedDiv.appendChild(rangedName)
            rangedDiv.appendChild(rangedDescription)

            // Save changes to localStorage when content is edited
            rangedName.addEventListener("blur", () => {
                if (rangedName.innerText.trim() === ""){
                    rangedName.innerText = "Ranged Weapon"
                }
                this.rangedWeapon.name = rangedName.innerText; // Update the object
                saveToStorage()
            })

            // Save changes to localStorage when content is edited
            rangedDescription.addEventListener("blur", () => {
                if (rangedDescription.innerText.trim() === ""){
                    rangedDescription.innerText = "Description"
                }
                this.rangedWeapon.description = rangedDescription.innerText; // Update the object
                saveToStorage()
            })


            //adds an overlay
            let rangedUsedOverlay = document.createElement("div")
            rangedUsedOverlay.id = "rangedUsedOverlay"
            rangedUsedOverlay.classList.add("slot-overlay")
            rangedDiv.appendChild(rangedUsedOverlay)

            //adds the slot used overlay
            let rangedUsed = document.createElement("div")
            rangedUsed.id = "rangedUsed"
            rangedUsed.classList.add("slot-used", "hidden")

            rangedUsedOverlay.appendChild(rangedUsed)
            rangedDiv.appendChild(rangedUsed)

            //adds an image on top of the overlay
            let rangedUsedLabel = document.createElement("img")
            rangedUsedLabel.src = "overlay.png"
            rangedUsedLabel.classList.add("slot-used-label", "hidden")
            rangedUsedLabel.id = "rangedUsedLabel"
            rangedDiv.append(rangedUsedLabel)

            //if they are not using a ranged weapon
            if (this.rangedWeaponFlag == true) {
                smallSlots.maxSize += 2
                updateCounter("smallSlotCounter")
                rangedUsed.classList.remove("hidden")
                rangedUsedLabel.classList.remove("hidden")
            }

        //BACKPACK SLOT

        let backpackDiv = document.createElement("div")
            backpackDiv.innerHTML = "<p>Backpack</p>"
            let backpackDivImg = document.createElement("img")
            backpackDivImg.src = this.backpack.image || ("empty_icons/backpack.png")
            backpackDivImg.classList.add("equipment-slot-image")

            let backpackFileInput = document.createElement("input")
            backpackFileInput.style.display = "none" // Hide the file input

            let backpackLabel = document.createElement("label")
            backpackLabel.appendChild(backpackDivImg)
            backpackLabel.appendChild(backpackFileInput)
            backpackDiv.appendChild(backpackLabel)

            //event listener for hte file input
            backpackFileInput.addEventListener("click", async (event) => {
                try {
                    const selectedIcon = await replaceImage();
                    backpackDivImg.src = selectedIcon;
                    this.backpack.image = selectedIcon;
                    saveToStorage();
                } catch (e) {
                    // User cancelled or closed modal
                    console.log("Icon selection cancelled");
                }
            })

            //appends the armor name to the div
            let backpackName = document.createElement("p")
            backpackName.innerText = this.backpack.name || "Backpack"
            backpackDiv.appendChild(backpackName)
            backpackName.contentEditable = "true"

            // Save changes to localStorage when content is edited
            backpackName.addEventListener("blur", () => {
                if (backpackName.innerText.trim() === ""){
                    backpackName.innerText = "Backpack"
                }
                this.backpack.name = backpackName.innerText; // Update the object
                saveToStorage()
            });

            //appends armor description to the div
            let backpackDescription = document.createElement("p")
            backpackDescription.innerText = this.backpack.description || "Description"
            backpackDiv.appendChild(backpackDescription)
            backpackDescription.contentEditable = "true"

            // Save changes to localStorage when content is edited
            backpackDescription.addEventListener("blur", () => {
                if (backpackDescription.innerText.trim() === ""){
                    backpackDescription.innerText = "Description"
                }
                this.backpack.description = backpackDescription.innerText; // Update the object
                saveToStorage()
            });

        //classlist to turn em into square boxes
        armorDiv.classList.add("equipment-slot", "armor-slot")
        helmetDiv.classList.add("equipment-slot", "helmet-slot")
        mainHandDiv.classList.add("equipment-slot", "main-hand-slot")
        offHandDiv.classList.add("equipment-slot", "off-hand-slot")
        rangedDiv.classList.add("equipment-slot", "ranged-weapon-slot")
        backpackDiv.classList.add("equipment-slot", "backpack-slot")

        //misc equipment array

        let miscEquipmentDiv = document.createElement("div")






        
        //two handed flag button

        let twoHandFlagButton = document.createElement("button")
        twoHandFlagButton.classList.add("toggle-button")
        
        let twoHandedButtonImg = document.createElement("img")
        twoHandedButtonImg.classList.add("toggle-button-image")
        twoHandedButtonImg.src = "empty_icons/shield.png" //change this soon

        twoHandFlagButton.appendChild(twoHandedButtonImg)

        

        
        twoHandFlagButton.addEventListener("click", () => {
            console.log("Two handed flag value is:", this.twoHandedFlag)
            this.twoHandedFlag = !this.twoHandedFlag //toggle the flag
            console.log("Two handed flag after togglin:", this.twoHandedFlag)
            if (this.twoHandedFlag) {
                let overlay = document.getElementById("offHandUsed")
                let overlayLabel = document.getElementById("offHandUsedLabel")
                overlay.classList.remove("hidden")
                overlayLabel.classList.remove("hidden")

                offHandName.contentEditable = "false"
                offHandDescription.contentEditable = "false"
            } else {
                let overlay = document.getElementById("offHandUsed")
                let overlayLabel = document.getElementById("offHandUsedLabel")
                overlay.classList.add("hidden")
                overlayLabel.classList.add("hidden")

                offHandName.contentEditable = "true"
                offHandDescription.contentEditable = "true"
            }

            saveToStorage()
        })

        let rangedWeaponButton = document.createElement("button")
        rangedWeaponButton.classList.add("toggle-button")

        let rangedWeaponButtonImg = document.createElement("img")
        rangedWeaponButtonImg.classList.add("toggle-button-image")
        rangedWeaponButtonImg.src = "empty_icons/ranged.png" //change this soon

        rangedWeaponButton.appendChild(rangedWeaponButtonImg)

        //rannged weapon flag TRUE = they are not using a ranged weapon, add 2
        //ranged weapon flag FALSE = they are using a ranged weapon, subtract 2 



        rangedWeaponButton.addEventListener("click", () => {
            //if they are not using a ranged weapon and decide they wanna toggle it but
            //not enough slots, it rejects it //what the fuck is this machine feedinng me
            //nah its cuz we're doing it backwards bruh
            console.log("current size", smallSlots.currentSize)
            console.log("max size", smallSlots.maxSize)
            if (this.rangedWeaponFlag && (smallSlots.maxSize - 2) < smallSlots.currentSize) {
                alert("You don't have enough inventory space to use a ranged weapon! Free up 2 small slots.")
                return
            }
            else {
                this.rangedWeaponFlag = !this.rangedWeaponFlag //toggle the flag
                //this means that they aren't using a ranged weapon
                if (this.rangedWeaponFlag) {
                    let overlay = document.getElementById("rangedUsed")
                    let overlayLabel = document.getElementById("rangedUsedLabel")
                    overlay.classList.remove("hidden")
                    overlayLabel.classList.remove("hidden")
    
                    rangedName.contentEditable = "false"
                    rangedDescription.contentEditable = "false"
    
                    smallSlots.maxSize += 2
                    updateCounter("smallSlotCounter")
                } 
                //this means that they are using a ranged weapon
                else {
                    let overlay = document.getElementById("rangedUsed")
                    let overlayLabel = document.getElementById("rangedUsedLabel")
                    overlay.classList.add("hidden")
                    overlayLabel.classList.add("hidden")
    
                    rangedName.contentEditable = "true"
                    rangedDescription.contentEditable = "true"
    
                    smallSlots.maxSize -= 2
                    updateCounter("smallSlotCounter")
                }
    
                saveToStorage()
            }

        })

        //render options
        let name = document.createElement("div")
        name.classList.add("name-bar")
        name.innerText = document.getElementById("playerName").innerText

        //appennd
        let miscArray = this.renderMiscEquipment()



        //append ts
        
        itemDiv.appendChild(helmetDiv)
        itemDiv.appendChild(armorDiv)
        itemDiv.appendChild(mainHandDiv)
        itemDiv.appendChild(offHandDiv)
        itemDiv.appendChild(rangedDiv)
        itemDiv.appendChild(backpackDiv)
        itemDiv.appendChild(name)
        offHandOverlay.appendChild(twoHandFlagButton)
        rangedUsedOverlay.appendChild(rangedWeaponButton)
        itemDiv.appendChild(miscArray)
        document.getElementById("standard-Slots").appendChild(itemDiv);
    }

    renderMiscEquipment(){
        //main div for the container
        let miscEquipmentDiv = document.createElement("div")
        miscEquipmentDiv.classList.add("misc-array-div")

        //creates the div that holds stuff inside
        let miscEquipmentContainer = document.createElement("div")
        miscEquipmentContainer.id = "miscEquipmentContainer"
        miscEquipmentContainer.classList.add("misc-array-container")

        miscEquipmentDiv.appendChild(miscEquipmentContainer)

        this.miscArmorSize = 0

        this.miscArmor.forEach(item => {
            console.log(item)
            let render = this.renderMiscItem(item)
            render.id = this.miscArmorSize
            miscEquipmentContainer.appendChild(render)
            this.miscArmorSize++
        })

    
        //let utilDiv = this.renderMiscUtility()
        //miscEquipmentContainer.appendChild(utilDiv)

        return miscEquipmentDiv
    }

    renderMiscItem(item){
        let miscItemDiv = document.createElement("div")
        miscItemDiv.classList.add("misc-item-div")
        miscItemDiv.dataset.id = this.miscArmorSize

        //overlay for the item to be appeneded
        let miscItem = document.createElement("div")
        miscItem.classList.add("misc-item")
        miscItemDiv.appendChild(miscItem)

        //image
        let miscItemImage = document.createElement("img")
        miscItemImage.classList.add("misc-image-tab")
        miscItemImage.src =   item.image || "empty_icons/necklace.png"

        //button for the image
        let miscItemImageChange = document.createElement("button")
        miscItemImageChange.style.display = "none"

        //label for the image
        let miscItemImageLabel = document.createElement("label")
        miscItemImageLabel.appendChild(miscItemImage)
        miscItemImageLabel.appendChild(miscItemImageChange)
        miscItemImageLabel.classList.add("misc-image-tab")

        //event listener for the label
        miscItemImageLabel.addEventListener("click", async (event) => {
            try {
                const selectedIcon = await replaceImage();
                miscItemImage.src = selectedIcon;
                item.image = selectedIcon;
                saveToStorage();
            } catch (e) {
                // User cancelled or closed modal
                console.log("Icon selection cancelled");
            }
        })        
        

        
        //name
        let miscItemName = document.createElement("p")
        miscItemName.classList.add("misc-name")
        miscItemName.innerText = item.name

        //desc
        let miscItemDesc = document.createElement("p")
        miscItemDesc.classList.add("misc-description")
        miscItemDesc.innerText = item.description

        //edit
        let miscItemEdit = document.createElement("button")
        miscItemEdit.classList.add("misc-item-edit")
        miscItemEdit.innerText = "Edit"

        //save
        let miscItemSave = document.createElement("button")
        miscItemSave.classList.add("misc-item-edit", "hidden")
        miscItemSave.innerText = "Save"

        //listener for the edit button
        miscItemEdit.addEventListener("click", function(){
            miscItemName.contentEditable = true
            miscItemDesc.contentEditable = true
            miscItemEdit.classList.add("hidden")
            miscItemSave.classList.remove("hidden")

            removeItemButton.classList.remove("hidden")
        })

        //listener for the save button
        miscItemSave.addEventListener("click", function(){
            miscItemName.contentEditable = false
            miscItemDesc.contentEditable = false
            console.log(miscItemName.innerText)
            console.log(miscItemDesc.innerText)
            miscItemEdit.classList.remove("hidden")
            miscItemSave.classList.add("hidden")   

            removeItemButton.classList.add("hidden")
            item.name = miscItemName.innerText
            item.description = miscItemDesc.innerText
            saveToStorage()        
        })

        let removeItemButton = document.createElement("button")

        removeItemButton.classList.add("hidden", "misc-delete-button")

        removeItemButton.addEventListener("click", (event) => {
            let choice = confirm("Are you sure you want to delete this item?")
            if (!choice){return}

            let itemDiv = event.target.closest(".misc-item-div")
            let itemID = parseInt(itemDiv.dataset.id)
            console.log(itemID)
            this.miscArmor.splice(itemID, 1)
            this.miscArmorSize--

            itemDiv.remove()
            saveToStorage()
        })

        miscItem.appendChild(miscItemImageLabel)
        miscItem.appendChild(miscItemName)
        miscItem.appendChild(miscItemDesc)
        miscItem.appendChild(miscItemEdit)
        miscItem.appendChild(miscItemSave)
        miscItem.appendChild(removeItemButton)

        return miscItemDiv
    }

    renderMiscUtility(){
        //fix this
        let utilDiv = document.createElement("div")
        utilDiv.classList.add("misc-item-div")

        let utilDivLayout = document.createElement("div")
        utilDivLayout.classList.add("misc-utils")
        utilDiv.appendChild(utilDivLayout)

        let addButton = document.createElement("button")
        addButton.classList.add("add-misc")
        addButton.innerText = "+"


        addButton.addEventListener("click", function(){
            //open the add misc item modal
            let modal = document.getElementById("miscItemModal")
            modal.style.display = "block"

            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none"
                }
            }            
        })

        utilDivLayout.appendChild(addButton)
        return utilDiv
    }

    saveMiscItem(){
        console.log(this.miscArmorSize)
        let miscItemName = document.getElementById("miscItemName")
        let miscItemDescription = document.getElementById("miscItemDescription")
        let MiscItem = new Item("empty_icons/necklace.png", miscItemName.value, "tiny", miscItemDescription.value)
        MiscItem.id = this.miscArmorSize
        try{
            this.miscArmor.push(MiscItem)
            this.miscArmorSize++
        }
        catch{
            console.error("Not able to append")
        }

        //generation works. rendering Last doesn't. id doesn't

        this.renderLastMisc()
        saveToStorage()
    }

    renderLastMisc(){
        console.log(this.miscArmor)
        let lastItem = this.miscArmor[this.miscArmor.length-1]
        console.log(lastItem)
        let render = this.renderMiscItem(lastItem)
        let container = document.getElementById("miscEquipmentContainer")
        
        container.insertBefore(render, container.children[container.children.length -1 ])

    }
}

export function addItem(){ //fix this and understand the rest
    let modal = document.getElementById("itemAddModal")
    modal.style.display = "block"


    function onWindowClick(event) {
        if (event.target == modal) {
            window.removeEventListener("click", onWindowClick)
            setImageReference(null)
            document.getElementById("addItemImage").src = "empty_icons/item.png"
            modal.style.display = "none";
        }
    }

    window.addEventListener("click", onWindowClick)
    
    /*
    window.onclick = function(event) {
        if (event.target == modal) {
            setImageReference(null)
            document.getElementById("addItemImage").src = "empty_icons/item.png"
            modal.style.display = "none";
        }        
    }
    */
}

function reassignID(slot){
    slot.items.forEach((item, i) => {
        item.id = i
    })
}

export function removeItem(){
    //what the fuck did i chatgpt here
    //you need to have it find the parent container and inncrement from there
    let toRemove = document.querySelectorAll(".remove-checkbox:checked")

    let slotSet = new Set()

    toRemove.forEach(element => {
        let itemDiv = element.closest(".itemDiv")
        let itemID = parseInt(itemDiv.dataset.id)

        let containerID = itemDiv.closest(".item-container").id
        let classification = getClassificationfromContainerID(containerID) //this allows you to update counter
        let slot = getSlotClassification(classification) //this gets the slot and deletes em

        if(slot){
            slotSet.add(slot)
            let toDelete = slot.items.findIndex(item => item.id === itemID)
            slot.items.splice(toDelete, 1)
            slot.currentSize--
            itemDiv.remove()

            updateCounter(`${classification}SlotCounter`)
        }

    })

    slotSet.forEach(slot => reassignID(slot))
    slotSet.clear()


    saveToStorage()
}


import { CoinPouch,emptyItem } from "./item.js"
import { smallSlots, mediumSlots, largeSlots, tinySlots } from "./logic.js"


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
        this.mainHand = emptyItem
        this.offHand = emptyItem
        this.rangedWeapon = emptyItem
        this.backpack = emptyItem
        this.rangedWeaponFlag = true //if you are using a ranged weapon or converting it into two small slots
        this.twoHandedFlag = false //if you are using two hands
        this.miscArmor = [] //for miscallaneous enchanted items
    }

    renderStandardSlots(){
        //create the slots
        let itemDiv = document.createElement("div")//create the div that holds the data
        itemDiv.classList.add("item-div")
        let leftColumn = document.createElement("div")
        let rightColumn = document.createElement("div")
        leftColumn.classList.add("left-column")
        rightColumn.classList.add("right-column")
        itemDiv.appendChild(leftColumn)
        itemDiv.appendChild(rightColumn)

        let armorDiv = document.createElement("div")
            let armorImg = document.createElement("img")
            armorImg.src = "QuincyPortrait.webp"
            armorImg.classList.add("equipment-slot-image")
            armorDiv.appendChild(armorImg)

            //appends the armor name to the div
            let armorName = document.createElement("p")
            armorName.contentEditable = "true"
            armorName.innerText = this.armorSlot.name
            armorDiv.appendChild(armorName)

            // Save changes to localStorage when content is edited
            armorName.addEventListener("blur", () => {
                if (armorName.innerText.trim() === ""){
                    armorName.innerText = "Armor Slot"
                }
                this.armorSlot.name = armorName.innerText; // Update the object
            });

            //appends armor description to the div
            let armorDescription = document.createElement("p")
            armorDescription.innerText = this.armorSlot.description
            armorDescription.contentEditable = "true"
            armorDiv.appendChild(armorDescription)

            // Save changes to localStorage when content is edited
            armorDescription.addEventListener("blur", () => {
                if (armorDescription.innerText.trim() === ""){
                    armorDescription.innerText = "Description"
                }
                this.armorSlot.description = armorDescription.innerText; // Update the object
            });

        let mainHandDiv = document.createElement("div")
            let mainHandImg = document.createElement("img")
            mainHandImg.src = "Claymore_29.webp"
            mainHandImg.classList.add("equipment-slot-image")
            mainHandDiv.appendChild(mainHandImg)

            //appends the main hand div
            let mainName = document.createElement("p")
            mainName.innerText = this.mainHand.name
            mainHandDiv.appendChild(mainName)
            mainName.contentEditable = "true"

            // Save changes to localStorage when content is edited
            mainName.addEventListener("blur", () => {
                if (mainName.innerText.trim() === ""){
                    mainName.innerText = "Main Hand"
                }
                this.mainHand.name = mainName.innerText; // Update the object
            });

            //appends description to main hand div
            let mainDescription = document.createElement("p")
            mainDescription.innerText = this.mainHand.description
            mainHandDiv.appendChild(mainDescription)        
            mainDescription.contentEditable = "true"
            
            // Save changes to localStorage when content is edited
            mainDescription.addEventListener("blur", () => {
                if (mainDescription.innerText.trim() === ""){
                    mainDescription.innerText = "Description"
                }
                this.mainHand.description = mainDescription.innerText; // Update the object
            });


        let offHandDiv = document.createElement("div")
            let offHandImg = document.createElement("img")
            offHandImg.src = "Claymore_29.webp"
            offHandImg.classList.add("equipment-slot-image")
            offHandDiv.appendChild(offHandImg)

            //appends the armor name to the div
            let offHandName = document.createElement("p")
            let offHandDescription = document.createElement("p")
            offHandName.contentEditable = "true"
            offHandDescription.contentEditable = "true"

            offHandName.innerText = this.offHand.name
            offHandDescription.innerText = this.offHand.description
            offHandDiv.appendChild(offHandName)
            offHandDiv.appendChild(offHandDescription)

            //adds an overlay on top 
            let offHandUsed = document.createElement("div")
            offHandUsed.id = "offHandUsed"
            offHandUsed.classList.add("slot-used", "hidden")
            offHandDiv.appendChild(offHandUsed)

            //adds an image on top of the overlay
            let offHandUsedLabel = document.createElement("img")
            offHandUsedLabel.src = "overlay.png"
            offHandUsedLabel.classList.add("slot-used-label", "hidden")
            offHandUsedLabel.id = "offHandUsedLabel"
            offHandDiv.append(offHandUsedLabel)

            console.log("this.twoHandedFlag Value is ", this.twoHandedFlag)

            if (this.twoHandedFlag == true) {
                offHandUsed.classList.remove("hidden")
                offHandUsedLabel.classList.remove("hidden")
            }

        let rangedDiv = document.createElement("div")
            let rangedDivImg = document.createElement("img")
            rangedDivImg.src = "bow.webp"
            rangedDivImg.classList.add("equipment-slot-image")
            rangedDiv.appendChild(rangedDivImg)
            //appends the armor name to the div
            let rangedName = document.createElement("p")
            let rangedDescription = document.createElement("p")
            rangedName.contentEditable = "true"
            rangedDescription.contentEditable = "true"

            rangedName.innerText = this.rangedWeapon.name
            rangedDescription.innerText = this.rangedWeapon.description

            rangedDiv.appendChild(rangedName)
            rangedDiv.appendChild(rangedDescription)

            //adds an overlay on top 
            let rangedUsed = document.createElement("div")
            rangedUsed.id = "rangedUsed"
            rangedUsed.classList.add("slot-used", "hidden")
            rangedDiv.appendChild(rangedUsed)

            //adds an image on top of the overlay
            let rangedUsedLabel = document.createElement("img")
            rangedUsedLabel.src = "overlay.png"
            rangedUsedLabel.classList.add("slot-used-label", "hidden")
            rangedUsedLabel.id = "rangedUsedLabel"
            rangedDiv.append(rangedUsedLabel)

            if (this.rangedWeaponFlag == true) {
                rangedUsed.classList.remove("hidden")
                rangedUsedLabel.classList.remove("hidden")
            }

        let backpackDiv = document.createElement("div")
            let backpackDivImg = document.createElement("img")
            backpackDivImg.src = "backpack.webp"
            backpackDivImg.classList.add("equipment-slot-image")
            backpackDiv.appendChild(backpackDivImg)
            //appends the armor name to the div
            let backpackName = document.createElement("p")
            backpackName.innerText = this.backpack.name
            backpackDiv.appendChild(backpackName)
            backpackName.contentEditable = "true"

            // Save changes to localStorage when content is edited
            backpackName.addEventListener("blur", () => {
                if (backpackName.innerText.trim() === ""){
                    backpackName.innerText = "Backpack"
                }
                this.backpack.name = backpackName.innerText; // Update the object
            });

            //appends armor description to the div
            let backpackDescription = document.createElement("p")
            backpackDescription.innerText = this.backpack.description
            backpackDiv.appendChild(backpackDescription)
            backpackDescription.contentEditable = "true"

            // Save changes to localStorage when content is edited
            backpackDescription.addEventListener("blur", () => {
                if (backpackDescription.innerText.trim() === ""){
                    backpackDescription.innerText = "Description"
                }
                this.backpack.description = backpackDescription.innerText; // Update the object
            });

        //classlist to turn em into square boxes
        armorDiv.classList.add("equipment-slot")
        mainHandDiv.classList.add("equipment-slot")
        offHandDiv.classList.add("equipment-slot")
        rangedDiv.classList.add("equipment-slot")
        backpackDiv.classList.add("equipment-slot")

        let twoHandFlagButton = document.createElement("button")
        twoHandFlagButton.innerText = "Two-Handed"

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
        })

        let rangedWeaponButton = document.createElement("button")
        rangedWeaponButton.innerText = "Using Ranged Weapon"        


        rangedWeaponButton.addEventListener("click", () => {
            this.rangedWeaponFlag = !this.rangedWeaponFlag //toggle the flag
            if (this.rangedWeaponFlag) {
                let overlay = document.getElementById("rangedUsed")
                let overlayLabel = document.getElementById("rangedUsedLabel")
                overlay.classList.remove("hidden")
                overlayLabel.classList.remove("hidden")

                rangedName.contentEditable = "false"
                rangedDescription.contentEditable = "false"
            } else {
                let overlay = document.getElementById("rangedUsed")
                let overlayLabel = document.getElementById("rangedUsedLabel")
                overlay.classList.add("hidden")
                overlayLabel.classList.add("hidden")

                rangedName.contentEditable = "true"
                rangedDescription.contentEditable = "true"
            }
        })

        //append ts
        rightColumn.appendChild(armorDiv)
        leftColumn.appendChild(mainHandDiv)
        leftColumn.appendChild(offHandDiv)
        leftColumn.appendChild(rangedDiv)
        leftColumn.appendChild(backpackDiv)
        rightColumn.appendChild(twoHandFlagButton)
        rightColumn.appendChild(rangedWeaponButton)
        document.getElementById("standard-Slots").appendChild(itemDiv);
    }
}

export function addItem(){ //fix this and understand the rest
    let modal = document.getElementById("itemAddModal")
    modal.style.display = "block"

    window.onclick = function(event) { //closes if you touch outside the modal
        if (event.target == modal) {
        modal.style.display = "none"
        }
    }
}

export function removeItem(){
    let toRemove = document.querySelectorAll(".remove-checkbox:checked")

    toRemove.forEach(element => {
        let itemDiv = element.closest(".itemDiv")
        let itemID = parseInt(itemDiv.dataset.id)
        let slot = getSlotClassification(itemDiv.dataset.classification)
        let item = slot.items.find(item => item.id === itemID)


        slot.items.splice(itemID, 1)
        slot.currentSize--
        itemDiv.remove()
    })
}
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

        let armorDiv = document.createElement("div")
<<<<<<< Updated upstream
=======
            let armorImg = document.createElement("img")
            armorImg.src = "QuincyPortrait.webp"
            armorImg.classList.add("armor-slot-image")
            armorDiv.appendChild(armorImg)

>>>>>>> Stashed changes
            //appends the armor name to the div
            let armorName = document.createElement("p")
            armorName.innerText = this.armorSlot.name
            armorDiv.appendChild(armorName)

            //appends armor description to the div
            let armorDescription = document.createElement("p")
            armorDescription.innerText = this.armorSlot.description
            armorDiv.appendChild(armorDescription)
        let mainHandDiv = document.createElement("div")
            //appends the main hand div
            let mainName = document.createElement("p")
            mainName.innerText = this.mainHand.name
            mainHandDiv.appendChild(mainName)

            //appends description to main hand div
            let mainDescription = document.createElement("p")
            mainDescription.innerText = this.mainHand.description
            mainHandDiv.appendChild(mainDescription)        
        let offHandDiv = document.createElement("div")
            //appends the armor name to the div
            let offHandName = document.createElement("p")
            let offHandDescription = document.createElement("p")

            if (this.twoHandedFlag = true) {
                this.offHand = emptyItem
            }

            offHandName.innerText = this.offHand.name
            offHandDescription.innerText = this.offHand.description
            offHandDiv.appendChild(offHandName)
            offHandDiv.appendChild(offHandDescription)

        let rangedDiv = document.createElement("div")
            //appends the armor name to the div
            let rangedName = document.createElement("p")
            let rangedDescription = document.createElement("p")

            if (this.rangedWeaponFlag = false) {
                this.rangedWeapon = emptyItem
            }

            rangedName.innerText = this.rangedWeapon.name
            rangedDescription.innerText = this.rangedWeapon.description

            rangedDiv.appendChild(rangedName)
            rangedDiv.appendChild(rangedDescription)

        let backpackDiv = document.createElement("div")
            //appends the armor name to the div
            let backpackName = document.createElement("p")
            backpackName.innerText = this.backpack.name
            backpackDiv.appendChild(backpackName)

            //appends armor description to the div
            let backpackDescription = document.createElement("p")
            backpackDescription.innerText = this.backpack.description
            backpackDiv.appendChild(backpackDescription)

        //classlist to turn em into square boxes
        armorDiv.classList.add("equipment-slot")
        mainHandDiv.classList.add("equipment-slot")
        offHandDiv.classList.add("equipment-slot")
        rangedDiv.classList.add("equipment-slot")
        backpackDiv.classList.add("equipment-slot")

        let twoHandFlagButton = document.createElement("button")
        twoHandFlagButton.innerText = "Two-Handed"

        let rangedWeaponButton = document.createElement("button")
        rangedWeaponButton.innerText = "Using Ranged Weapon"        

        itemDiv.className = 'bg-blue-500 text-white p-4 rounded-lg'
        //append ts
        itemDiv.appendChild(armorDiv)
        itemDiv.appendChild(mainHandDiv)
        itemDiv.appendChild(offHandDiv)
        itemDiv.appendChild(rangedDiv)
        itemDiv.appendChild(backpackDiv)
        itemDiv.appendChild(twoHandFlagButton)
        itemDiv.appendChild(rangedWeaponButton)
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
export function getSlotClassification(classification){
    const slotMap = {
        "small": smallSlots,
        "medium": mediumSlots,
        "large": largeSlots,
        "tiny": tinySlots,
    }
    return slotMap[classification] || null
}
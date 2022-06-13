export function disableInput(props, memberName) {
    const member = props.members.find(e => e.name == memberName)

    if(member.isChecked)
        return false
    else
        return true
}

export function handleChange(props, e) {
    let isChecked = e.target.checked

    // Passing name of the member to handleCheck function defined in CreateBill.js
    props.handleCheck(e.target.value)

    if(isChecked)
        props.setMemberCnt(props.memberCnt + 1)
    else
        props.setMemberCnt(props.memberCnt - 1)
}

export function handleSplitAmount(member, e) {
    if(e.target.value)
        member.amount = e.target.value
    else
        member.amount = 0
}

export function resetCheckBoxes(props) {
    props.setMemberCnt(props.members.length)

    props.members.forEach(element => {
            element.isChecked = true
    });
}

export function initMemberValues(members){
    let i = 0
    const arr = members.map(m => {
        let memberValue = { index: i, amount: m.amount }

        i++

        return memberValue
    });

    return arr
}
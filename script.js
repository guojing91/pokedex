

let dropdown = document.getElementById('dropdown');
let searchInput = document.getElementById('searchInput');
let dropdownItems = document.getElementById('dropdownItems');
let actionButton = document.getElementById('actionButton');
let selectedName;
let pokemonName = document.getElementById('pokemonName');
let pokemonGenus = document.getElementById('pokemonGenus');
let dexNo = document.getElementById('dexNo');
let front = document.getElementById('front');
let shiny = document.getElementById('shiny');
let abilities = document.getElementById('abilities');
let types = document.getElementById('types');
let stats = document.getElementById('stats');
let moveTableLevel = document.getElementById('moveTableLevel');
let moveTableTM = document.getElementById('moveTableTM');
let moveTableEgg = document.getElementById('moveTableEgg');
let overlay = document.getElementById('overlay');
let abilityPopup = document.getElementById('abilityPopup');
let abilityTitle = document.getElementById('abilityTitle');
let abilityBody = document.getElementById('abilityBody');
let movePopup = document.getElementById('movePopup');
let closePopupButtons = document.querySelectorAll('#closeButton');
let moveTitle = document.getElementById('moveTitle');
let moveTypeValue = document.getElementById('moveTypeValue');
let damageClassValue = document.getElementById('damageClassValue');
let basePowerValue = document.getElementById('basePowerValue');
let accuracyValue = document.getElementById('accuracyValue');
let moveDescriptionValue = document.getElementById('moveDescriptionValue');
let moveEffectValue = document.getElementById('moveEffectValue');
let evolution = document.getElementById('evolution');
let baseEvo = document.getElementById('baseEvo');
let firstEvo = document.getElementById('firstEvo');
let secondEvo = document.getElementById('secondEvo');

// Create dropdown menu using database details

function generateDropdownMenu() {
    return (dropdownItems.innerHTML = pokemonDetails.map((pokemon) => {
        let displayName = pokemon.display;
        return `
        <a href="#" class="item" id="item">${displayName}</a>
        `;
    }).join(""));
}

generateDropdownMenu();

// Dropdown menu to select pokemon

var items = document.querySelectorAll('#item');

// Close dropdown menu

function closeDropdown() {
    dropdownItems.classList.remove("show");
}

// When menu is clicked and pokemon is selected, close dropdown menu

dropdownItems.addEventListener('click', () => {
    dropdownItems.classList.toggle('show');
})

// Show selected item on search input field when clicked

items.forEach(item => {
    item.addEventListener('click', () => {
        searchInput.value = item.innerHTML;
        pokemonDetails.forEach((pokemon) => {
            if (pokemon.display === item.innerHTML) {
                selectedName = pokemon.name;
            }
        });
        getDexNo();
        showName();
        searchInput.value = "";
        getGenus();
        getOfficialArtwork();
        getAbilities();
        getTypes();
        getStats();
        getLevelUpMoves();
        getTMMoves();
        getEggMoves();
        showEvolution();
    });
})

// Close dropdown menu when anywhere on the document is clicked

document.addEventListener("click", function (event) {
    if (!dropdown.contains(event.target) && event.target !== searchInput) {
        closeDropdown();
    }
});

// To filter menu base on user input

searchInput.addEventListener("input", function () {
    var filter = searchInput.value.toUpperCase();
    var items = dropdownItems.getElementsByClassName("item");
    for (var i = 0; i < items.length; i++) {
        var txtValue = items[i].textContent || items[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
        dropdownItems.classList.add('show');
    }

    // Show dropdown if input is not empty
    if (searchInput.value.trim() !== "") {
        dropdownItems.classList.add("show");
    } else {
        closeDropdown();
    }
});

// Fetch pokemon details from pokeAPI

function showName() {
    pokemonName.innerHTML = `<p>${searchInput.value}</p>`;
}

function getGenus() {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            data.genera.forEach((generaItem) => {
                if (generaItem.language.name === "en") {
                    pokemonGenus.innerHTML = `<p>${generaItem.genus}</p>`;
                }
            })
        })
}

function getDetails() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedName}/`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            let pokemonData = data;
            console.log(pokemonData);
        })
        .catch(error => {
            console.log('Error:', error);
        })
}

function getDexNo() {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            if (data.id < 10) {
                dexNo.innerHTML = `<p>#00${data.id}<\p>`;
            } else if (data.id.length < 100) {
                dexNo.innerHTML = `<p>#0${data.id}<\p>`;
            } else {
                dexNo.innerHTML = `<p>#${data.id}<\p>`;
            }
        })
}

function getOfficialArtwork() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            let frontDefault = data.sprites.other["official-artwork"]["front_default"];
            let frontShiny = data.sprites.other["official-artwork"]["front_shiny"];
            front.innerHTML = `<img src="${frontDefault}" alt=""><p>Default</p>`;
            shiny.innerHTML = `<img src="${frontShiny}" alt=""><p>Shiny</p>`;
        })
        .catch(error => {
            console.log('Error:', error);
        })
}

function getAbilities() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            let abilitiesAll = `
            <p>Ability</p>
            <div class="normal-ability">`;
            for (let i = 0; i < data.abilities.length; i++) {
                let abilityOriName = data.abilities[i].ability.name;
                let abilityName = abilityOriName.replace(/(?:^|-)(\w)/g, function (match) {
                    return match.toUpperCase();
                }).replace(/-/g, ' ');
                if (data.abilities[i].is_hidden != true) {
                    abilitiesAll += `
                    <p class="ability" id="ability">${abilityName}</p>
                    `;
                } else {
                    abilitiesAll += `
                    </div>
                    <p>Hidden</p>
                    <p class="ability" id="ability">${abilityName}</p>
                    `;
                }
            }
            abilities.innerHTML = abilitiesAll;
            let abilityList = document.querySelectorAll('#ability');
            abilityList.forEach((ability) => {
                ability.addEventListener('click', function () {
                    let simplifiedAbility = ability.innerHTML.toLowerCase().replace(/\s+/g, '-').replace(/-$/, '');
                    fetch(`https://pokeapi.co/api/v2/ability/${simplifiedAbility}`)
                        .then(blob1 => {
                            if (!blob1.ok) {
                                throw new Error('Failed to fetch data');
                            }
                            return blob1.json();
                        })
                        .then(data1 => {
                            for (let i = 0; i < data1.effect_entries.length; i++) {
                                if (data1.effect_entries[i].language.name === "en") {
                                    abilityBody.innerHTML = data1.effect_entries[i].effect;
                                }
                            }
                            abilityTitle.innerHTML = simplifiedAbility.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        })
                    openAbilityPopUp();

                    closePopupButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            closeAbilityPopUp();
                        })
                    })

                    overlay.addEventListener('click', () => {
                        closeAbilityPopUp();
                    })
                })
            })
        })
        .catch(error => {
            console.log('Error:', error);
        })
}

function openAbilityPopUp() {
    abilityPopup.classList.add('active');
    overlay.classList.add('active');
}

function closeAbilityPopUp() {
    abilityPopup.classList.remove('active');
    overlay.classList.remove('active');
}

function getTypes() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            let typesDetails = '<p>Types</p><div class="type-container">';
            for (let i = 0; i < data.types.length; i++) {
                let typeOriName = data.types[i].type.name;
                let typeName = typeOriName.charAt(0).toUpperCase() + typeOriName.slice(1)
                if (data.types.length - 1 == 0) {
                    typesDetails += `<p class="type-box type-box${i}" id="typeBox">${typeName}</p>`
                } else {
                    typesDetails += `<p class="type-box type-box${i}" id="typeBox">${typeName}</p>\n`
                }
            }
            typesDetails += '</div>';
            types.innerHTML = typesDetails;
            let typeBoxes = document.getElementsByClassName('type-box');
            for (let j = 0; j < data.types.length; j++) {
                let selectedType = typeBoxes[j].innerHTML;
                let boxToColor = document.querySelector(`.type-box${j}`);
                let color = typeColors[selectedType];
                boxToColor.style.backgroundColor = color;
            }
        })
        .catch(error => {
            console.log('Error:', error);
        })
}

function getStats() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            let statsHP = data.stats[0].base_stat;
            let statsAtt = data.stats[1].base_stat;
            let statsDef = data.stats[2].base_stat;
            let statsSpAtt = data.stats[3].base_stat;
            let statsSpDef = data.stats[4].base_stat;
            let statsSpeed = data.stats[5].base_stat;

            stats.innerHTML = `
            <div class="stats-title" id="stats-title">
                <p>Stats</p>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td class="stat">HP:</td>
                        <td>${statsHP}</td>
                        <td class="stat"><div class="stats-height stats-hp"></div></td>
                        </tr>
                        <tr>
                        <td class="stat">Attack:</td>
                        <td>${statsAtt}</td>
                        <td class="stat"><div class="stats-height stats-att"></div></td>
                        </tr>
                        <tr>
                        <td class="stat">Defense:</td>
                        <td>${statsDef}</td>
                        <td class="stat"><div class="stats-height stats-def"></div></td>
                        </tr>
                        <tr>
                        <td class="stat">Sp. Att.:</td>
                        <td>${statsSpAtt}</td>
                        <td class="stat"><div class="stats-height stats-spatt"></div></td>
                        </tr>
                        <tr>
                        <td class="stat">Sp. Def.:</td>
                        <td>${statsSpDef}</td>
                        <td class="stat"><div class="stats-height stats-spdef"></div></td>
                        </tr>
                        <tr>
                        <td class="stat">Speed:</td>
                        <td>${statsSpeed}</td>
                        <td class="stat"><div class="stats-height stats-speed"></div></td>
                    </tr>
                    <tr>
                        <td class="stat">Total:</td>
                        <td>${statsHP + statsAtt + statsDef + statsSpAtt + statsSpDef + statsSpeed}</td>
                    </tr>
                </tbody>
            </table>
            `;

            document.querySelector('.stats-hp').style.cssText = `width: ${statsHP / 200 * 100}%; background-color: #04AA6D`;
            document.querySelector('.stats-att').style.cssText = `width: ${statsAtt / 200 * 100}%; background-color: #2196F3`;
            document.querySelector('.stats-def').style.cssText = `width: ${statsDef / 200 * 100}%; background-color: #F44336`;
            document.querySelector('.stats-spatt').style.cssText = `width: ${statsSpAtt / 200 * 100}%; background-color: #B434EB`;
            document.querySelector('.stats-spdef').style.cssText = `width: ${statsSpDef / 200 * 100}%; background-color: #EB9B34`;
            document.querySelector('.stats-speed').style.cssText = `width: ${statsSpeed / 200 * 100}%; background-color: #5E420C`;
        })
        .catch(error => {
            console.log('Error:', error);
        })
}

function getLevelUpMoves() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            let moveTableLevelDetails = `
            <div>
                <p>Moveset</p>
            </div>
            <div>
                <p>By leveling up</p>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Move</th>
                        </tr>
                    </thead>
                    <tbody id="tableBodyLevel">
            `;
            for (let i = 0; i < data.moves.length; i++) {
                let moveOriName = data.moves[i].move.name;
                let moveName;
                if (moveOriName === "u-turn") {
                    moveName = "U-turn";
                } else if (moveOriName === "x-scissor") {
                    moveName = "X-Scissor";
                } else if (moveOriName === "will-o-wisp") {
                    moveName = "Will-O-Wisp";
                } else if (moveOriName === "double-edge") {
                    moveName = "Double-Edge";
                } else {
                    moveName = moveOriName.replace(/(?:^|-)(\w)/g, function (match) {
                        return match.toUpperCase();
                    }).replace(/-/g, ' ');
                }
                let moveSV = data.moves[i].version_group_details[data.moves[i].version_group_details.length - 1].version_group.name;
                if (moveSV === 'scarlet-violet') {
                    for (let j = 0; j < data.moves[i].version_group_details.length; j++) {
                        let learnLevel = data.moves[i].version_group_details[j].level_learned_at;
                        let moveLearnMethod = data.moves[i].version_group_details[j].move_learn_method.name;
                        let versionName = data.moves[i].version_group_details[j].version_group.name;
                        if (moveLearnMethod === 'level-up' && versionName === 'scarlet-violet') {
                            moveTableLevelDetails += `
                            <tr>
                                <td>${learnLevel}</td>
                                <td class="access-move-details" id="accessMoveDetails">${moveName}</td>
                            </tr>`;
                        }
                    }
                } else if (moveSV === 'brilliant-diamond-and-shining-pearl') {
                    for (let j = 0; j < data.moves[i].version_group_details.length; j++) {
                        let learnLevel = data.moves[i].version_group_details[j].level_learned_at;
                        let moveLearnMethod = data.moves[i].version_group_details[j].move_learn_method.name;
                        let versionName = data.moves[i].version_group_details[j].version_group.name;
                        if (moveLearnMethod === 'level-up' && versionName === 'brilliant-diamond-and-shining-pearl') {
                            moveTableLevelDetails += `
                            <tr>
                                <td>${learnLevel}</td>
                                <td class="access-move-details" id="accessMoveDetails">${moveName}</td>
                            </tr>`;
                        }
                    }
                }
            }
            moveTableLevelDetails += `
                    </tbody>
                </table>
            </div>`;
            moveTableLevel.innerHTML = moveTableLevelDetails;
            sortLevelTable(0);
        })
        .catch(error => {
            console.log('Error:', error);
        })
}

function sortLevelTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, switchcount = 0;
    table = document.getElementById('tableBodyLevel');
    switching = true;
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("tr");
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = parseFloat(rows[i].getElementsByTagName("td")[n].innerHTML);
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[n].innerHTML);
            if (x > y) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        }
    }
}

function getTMMoves() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            let moveTableTMDetails = `
            <div>
                <p>By TM</p>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>TM Number</th>
                            <th>Move</th>
                        </tr>
                    </thead>
                    <tbody id="tableBodyTM">
            `;
            for (let k = 0; k < pokemonDetails.length; k++) {
                if ((pokemonDetails[k].name === selectedName) && pokemonDetails[k]['latest-version'] === 'scarlet-violet') {
                    for (let i = 0; i < data.moves.length; i++) {
                        let moveOriName = data.moves[i].move.name;
                        let moveName;
                        if (moveOriName === "u-turn") {
                            moveName = "U-turn";
                        } else if (moveOriName === "x-scissor") {
                            moveName = "X-Scissor";
                        } else if (moveOriName === "will-o-wisp") {
                            moveName = "Will-O-Wisp";
                        } else if (moveOriName === "double-edge") {
                            moveName = "Double-Edge";
                        } else {
                            moveName = moveOriName.replace(/(?:^|-)(\w)/g, function (match) {
                                return match.toUpperCase();
                            }).replace(/-/g, ' ');
                        }
                        for (let j = 0; j < data.moves[i].version_group_details.length; j++) {
                            let moveLearnMethod = data.moves[i].version_group_details[j].move_learn_method.name;
                            let versionName = data.moves[i].version_group_details[j].version_group.name;
                            if (moveLearnMethod === 'machine' && versionName === pokemonDetails[k]['latest-version']) {
                                let tmNumber = getTMNumberfromSVTMMoves(moveOriName);
                                moveTableTMDetails += `
                                        <tr>
                                        <td>${tmNumber}</td>
                                        <td class="access-move-details" id="accessMoveDetails">${moveName}</td>
                                        </tr>`;
                            }
                        }
                    }
                } else if ((pokemonDetails[k].name === selectedName) && pokemonDetails[k]['latest-version'] === 'brilliant-diamond-and-shining-pearl') {
                    for (let i = 0; i < data.moves.length; i++) {
                        let moveOriName = data.moves[i].move.name;
                        let moveName;
                        if (moveOriName === "u-turn") {
                            moveName = "U-turn";
                        } else if (moveOriName === "x-scissor") {
                            moveName = "X-Scissor";
                        } else if (moveOriName === "will-o-wisp") {
                            moveName = "Will-O-Wisp";
                        } else if (moveOriName === "double-edge") {
                            moveName = "Double-Edge";
                        } else {
                            moveName = moveOriName.replace(/(?:^|-)(\w)/g, function (match) {
                                return match.toUpperCase();
                            }).replace(/-/g, ' ');
                        }
                        for (let j = 0; j < data.moves[i].version_group_details.length; j++) {
                            let moveLearnMethod = data.moves[i].version_group_details[j].move_learn_method.name;
                            let versionName = data.moves[i].version_group_details[j].version_group.name;
                            if (moveLearnMethod === 'machine' && versionName === pokemonDetails[k]['latest-version']) {
                                let tmNumber = getTMNumberfromBDSPTMMoves(moveOriName);
                                moveTableTMDetails += `
                                        <tr>
                                        <td>${tmNumber}</td>
                                        <td class="access-move-details" id="accessMoveDetails">${moveName}</td>
                                        </tr>`;
                            }
                        }
                    }
                }
            }
            moveTableTMDetails += `
                    </tbody>
                </table>
            </div>`;
            moveTableTM.innerHTML = moveTableTMDetails;
            sortTMTable();
        })
        .catch(error => {
            console.log('Error:', error);
        })
}

function sortTMTable() {
    let table = document.getElementById('tableBodyTM');
    let rows = Array.from(table.getElementsByTagName('tr'));
    let data = rows.map(function (row) {
        return {
            tmNumber: row.cells[0].textContent.trim(),
            moveName: row.cells[1].textContent.trim()
        };
    });
    data.sort(function (a, b) {
        return parseInt(a.tmNumber.replace("TM", "")) - parseInt(b.tmNumber.replace("TM", ""));
    });
    data.forEach(function (item, index) {
        rows[index].cells[0].textContent = item.tmNumber;
        rows[index].cells[1].textContent = item.moveName;
    });
}

function getTMNumberfromSVTMMoves(codeName) {
    let move = movesTMSV.find(move => move.codeName === codeName);

    if (move) {
        return move.tm;
    } else {
        return "Not found";
    }
}

function getTMNumberfromBDSPTMMoves(codeName) {
    let move = movesTMBDSP.find(move => move.codeName === codeName);

    if (move) {
        return move.tm;
    } else {
        return "Not found";
    }
}

function getEggMoves() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            let moveTableEggDetails = `
            <div>
                <p>By Breeding</p>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Parent</th>
                            <th>Move</th>
                        </tr>
                    </thead>
                    <tbody id="tableBodyEgg">
            `;
            for (let k = 0; k < pokemonDetails.length; k++) {
                if ((pokemonDetails[k].name === selectedName) && pokemonDetails[k]['latest-version'] === 'scarlet-violet') {
                    for (let i = 0; i < data.moves.length; i++) {
                        let moveOriName = data.moves[i].move.name;
                        let moveName;
                        if (moveOriName === "u-turn") {
                            moveName = "U-turn";
                        } else if (moveOriName === "x-scissor") {
                            moveName = "X-Scissor";
                        } else if (moveOriName === "will-o-wisp") {
                            moveName = "Will-O-Wisp";
                        } else if (moveOriName === "double-edge") {
                            moveName = "Double-Edge";
                        } else {
                            moveName = moveOriName.replace(/(?:^|-)(\w)/g, function (match) {
                                return match.toUpperCase();
                            }).replace(/-/g, ' ');
                        }
                        for (let j = 0; j < data.moves[i].version_group_details.length; j++) {
                            let moveLearnMethod = data.moves[i].version_group_details[j].move_learn_method.name;
                            let versionName = data.moves[i].version_group_details[j].version_group.name;
                            if (moveLearnMethod === 'egg' && versionName === pokemonDetails[k]['latest-version']) {
                                moveTableEggDetails += `
                                        <tr>
                                        <td>Egg/Camp</td>
                                        <td class="access-move-details" id="accessMoveDetails">${moveName}</td>
                                        </tr>`;
                            }
                        }
                    }
                } else if ((pokemonDetails[k].name === selectedName) && pokemonDetails[k]['latest-version'] === 'brilliant-diamond-and-shining-pearl') {
                    for (let i = 0; i < data.moves.length; i++) {
                        let moveOriName = data.moves[i].move.name;
                        let moveName;
                        if (moveOriName === "u-turn") {
                            moveName = "U-turn";
                        } else if (moveOriName === "x-scissor") {
                            moveName = "X-Scissor";
                        } else if (moveOriName === "will-o-wisp") {
                            moveName = "Will-O-Wisp";
                        } else if (moveOriName === "double-edge") {
                            moveName = "Double-Edge";
                        } else {
                            moveName = moveOriName.replace(/(?:^|-)(\w)/g, function (match) {
                                return match.toUpperCase();
                            }).replace(/-/g, ' ');
                        }
                        for (let j = 0; j < data.moves[i].version_group_details.length; j++) {
                            let moveLearnMethod = data.moves[i].version_group_details[j].move_learn_method.name;
                            let versionName = data.moves[i].version_group_details[j].version_group.name;
                            if (moveLearnMethod === 'egg' && versionName === pokemonDetails[k]['latest-version']) {
                                moveTableEggDetails += `
                                        <tr>
                                        <td>Egg</td>
                                        <td class="access-move-details" id="accessMoveDetails">${moveName}</td>
                                        </tr>`;
                            }
                        }
                    }
                }
            }
            moveTableEggDetails += `
                    </tbody>
                </table>
            </div>`;
            moveTableEgg.innerHTML = moveTableEggDetails;
            sortEggTable();
            showMoveDetails();
        })
        .catch(error => {
            console.log('Error:', error);
        })
}

function sortEggTable() {
    let table = document.getElementById('tableBodyEgg');
    let rows = Array.from(table.getElementsByTagName('tr'));
    let data = rows.map(function (row) {
        return {
            breedingMethod: row.cells[0].textContent.trim(),
            moveName: row.cells[1].textContent.trim()
        };
    });
    data.sort(function (a, b) {
        return a.moveName.localeCompare(b.moveName);
    });

    data.forEach(function (item, index) {
        rows[index].cells[0].textContent = item.breedingMethod;
        rows[index].cells[1].textContent = item.moveName;
    })
}

function showMoveDetails() {
    let accessMoveDetails = document.querySelectorAll('#accessMoveDetails');

    accessMoveDetails.forEach((move) => {
        move.addEventListener('click', function () {
            let moveName = move.innerHTML.toLowerCase().replace(/\s+/g, '-');
            fetch(`https://pokeapi.co/api/v2/move/${moveName}/`)
                .then(blob => {
                    if (!blob.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    return blob.json();
                })
                .then(data => {
                    moveTitle.innerHTML = move.innerHTML;
                    moveTypeValue.innerHTML = data.type.name.replace(/(?:^|-)(\w)/g, function (match) {
                        return match.toUpperCase();
                    }).replace(/-/g, ' ');
                    damageClassValue.innerHTML = data.damage_class.name.replace(/(?:^|-)(\w)/g, function (match) {
                        return match.toUpperCase();
                    }).replace(/-/g, ' ');
                    if (data.power == null) {
                        basePowerValue.innerHTML = '-';
                    } else {
                        basePowerValue.innerHTML = data.power;
                    }
                    if (data.accuracy == null) {
                        accuracyValue.innerHTML = "-";
                    } else {
                        accuracyValue.innerHTML = data.accuracy;
                    }
                    if (data.flavor_text_entries != "") {
                        for (let i = 0; i < data.flavor_text_entries.length; i++) {
                            if ((data.flavor_text_entries[i].version_group.name === "sword-shield") && data.flavor_text_entries[i].language.name === "en") {
                                moveDescriptionValue.innerHTML = data.flavor_text_entries[i].flavor_text;
                            }
                        }
                    } else {
                        moveDescriptionValue.innerHTML = "Not Available"
                    }
                    if (data.effect_entries != "") {
                        moveEffectValue.innerHTML = data.effect_entries[0].short_effect;
                    } else {
                        moveEffectValue.innerHTML = "Not Available"
                    }
                    openMovePopUp();

                    closePopupButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            closeMovePopUp();
                        })
                    })

                    overlay.addEventListener('click', () => {
                        closeMovePopUp();
                    })
                })
                .catch(error => {
                    console.log('Error:', error);
                })
        })
    })
}

function openMovePopUp() {
    movePopup.classList.add('active');
    overlay.classList.add('active');
}

function closeMovePopUp() {
    movePopup.classList.remove('active');
    overlay.classList.remove('active');
}

function showEvolution() {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${selectedName}`)
        .then(blob => {
            if (!blob.ok) {
                throw new Error('Failed to fetch data');
            }
            return blob.json();
        })
        .then(data => {
            fetch(data.evolution_chain.url)
                .then(blob1 => {
                    if (!blob1.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    return blob1.json();
                })
                .then(data1 => {
                    let baseEvoDesc = "";
                    let firstEvoDesc = "";
                    let secondEvoDesc = "";
                    if (data1.chain.evolves_to != "") {
                        let pokemonBaseEvoName = "";
                        for (let i = 0; i < pokemonDetails.length; i++) {
                            if (pokemonDetails[i].name === data1.chain.species.name) {
                                pokemonBaseEvoName = pokemonDetails[i].display;
                            } else {
                                pokemonBaseEvoName = data1.chain.species.name.replace(/-/g, ' ').replace(/\b\w/g, function (char) {
                                    return char.toUpperCase();
                                });
                            }
                        }
                        baseEvoDesc += `<div id="pendingSelection">${pokemonBaseEvoName}</div>`;
                        baseEvo.innerHTML = baseEvoDesc;
                        for (let i = 0; i < data1.chain.evolves_to.length; i++) {
                            let pokemonFirstEvoName = "";
                            for (let k = 0; k < pokemonDetails.length; k++) {
                                if (pokemonDetails[k].name === data1.chain.evolves_to[i].species.name) {
                                    pokemonFirstEvoName = pokemonDetails[k].display;
                                } else {
                                    pokemonFirstEvoName = data1.chain.evolves_to[i].species.name.replace(/-/g, ' ').replace(/\b\w/g, function (char) {
                                        return char.toUpperCase();
                                    });
                                }
                            }
                            firstEvoDesc += `
                            <div>
                                <div>Evolution 1</div>
                                <div id="pendingSelection">${pokemonFirstEvoName}</div>`;
                            for (let key in data1.chain.evolves_to[i].evolution_details[0]) {
                                let keyName = key.replace(/_/g, ' ').replace(/\b\w/g, function (char) {
                                    return char.toUpperCase();
                                });
                                if (data1.chain.evolves_to[i].evolution_details[0][key] == null) { }
                                else if (data1.chain.evolves_to[i].evolution_details[0][key] == false) { }
                                else if (data1.chain.evolves_to[i].evolution_details[0][key] === "") { }
                                else {
                                    if (key === "min_level" || key === "min_happiness") {
                                        firstEvoDesc += `
                                            <div>${keyName}</div>
                                            <div>${data1.chain.evolves_to[i].evolution_details[0][key]}</div>
                                        </div>`
                                    } else {
                                        let methodName = data1.chain.evolves_to[i].evolution_details[0][key].name.replace(/-/g, ' ').replace(/\b\w/g, function (char) {
                                            return char.toUpperCase();
                                        });
                                        firstEvoDesc += `
                                            <div>${keyName}</div>
                                            <div>${methodName}</div>
                                        </div>`
                                    }
                                }
                            }
                            if (data1.chain.evolves_to[i].evolves_to != "") {
                                for (let j = 0; j < data1.chain.evolves_to[i].evolves_to.length; j++) {
                                    let pokemonSecondEvoName = "";
                                    for (let m = 0; m < pokemonDetails.length; m++) {
                                        if (pokemonDetails[m].name === data1.chain.evolves_to[i].evolves_to[j].species.name) {
                                            pokemonSecondEvoName = pokemonDetails[m].display;
                                        } else {
                                            pokemonSecondEvoName = data1.chain.evolves_to[i].evolves_to[j].species.name.replace(/-/g, ' ').replace(/\b\w/g, function (char) {
                                                return char.toUpperCase();
                                            });
                                        }
                                    }
                                    secondEvoDesc += `
                                    <div>
                                        <div>Evolution 2</div>
                                        <div id="pendingSelection">${pokemonSecondEvoName}</div>`;
                                    for (let key in data1.chain.evolves_to[i].evolves_to[j].evolution_details[0]) {
                                        let keyName = key.replace(/_/g, ' ').replace(/\b\w/g, function (char) {
                                            return char.toUpperCase();
                                        });
                                        if (data1.chain.evolves_to[i].evolves_to[j].evolution_details[0][key] == null) { }
                                        else if (data1.chain.evolves_to[i].evolves_to[j].evolution_details[0][key] == false) { }
                                        else if (data1.chain.evolves_to[i].evolves_to[j].evolution_details[0][key] === "") { }
                                        else {
                                            if (key === "min_level" || key === "min_happiness") {
                                                secondEvoDesc += `
                                                    <div>${keyName}</div>
                                                    <div>${data1.chain.evolves_to[i].evolves_to[j].evolution_details[0][key]}</div>
                                                </div>`
                                            } else {
                                                let methodName = data1.chain.evolves_to[i].evolves_to[j].evolution_details[0][key].name.replace(/-/g, ' ').replace(/\b\w/g, function (char) {
                                                    return char.toUpperCase();
                                                });
                                                secondEvoDesc += `
                                                    <div>${keyName}</div>
                                                    <div>${methodName}</div>
                                                </div>`
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        firstEvo.innerHTML = firstEvoDesc;
                        secondEvo.innerHTML = secondEvoDesc;
                    } else {
                        baseEvo.innerHTML = "This Pokemon has no evolutions.";
                        firstEvo.innerHTML = "";
                        secondEvo.innerHTML = "";
                    }
                    let pendingSelections = document.querySelectorAll('#pendingSelection');
                    pendingSelections.forEach((selected) => {
                        selected.addEventListener('click', function () {
                            for (let i = 0; i < pokemonDetails.length; i++) {
                                if (selected.innerHTML === pokemonDetails[i].display) {
                                    selectedName = pokemonDetails[i].name;
                                }
                            }
                            getDexNo();
                            showName();
                            searchInput.value = "";
                            getGenus();
                            getOfficialArtwork();
                            getAbilities();
                            getTypes();
                            getStats();
                            getLevelUpMoves();
                            getTMMoves();
                            getEggMoves();
                            showEvolution();
                            window.scrollTo(0, 0);
                        });
                    });
                })
                .catch(error => {
                    console.log('Error:', error);
                })
        })
        .catch(error => {
            console.log('Error:', error);
        })
}
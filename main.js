// --- Load Local Storage ---

let score = localStorage.getItem('score')
score = (score === null) ? 0 : Number(score)


// --- Variables ---

// Game Vars
const cheats = true
const gridWidth = 5, gridHeight = 6
const prizes = [200, 400, 600, 800, 1000]

let categories = []
let questions = {}

let gridItems = []
let activeItem = {}

// Doc Elements
const scoreTXT = $('#score')[0]
const grid = $('#grid')
const form = $('#answerform')
const questionTXT = $('#question')[0]
const submit_btn = $('.submit-btn')
const submit_text = $('.submit-text')


// --- Initialization ---
loadGame()

// --- Load Game ---
async function loadGame() {

    // Get the jeopardy data from the JSON file
    const rawJeopardyData = await fetch('jeopardy.json')
    const jeopardyData = await rawJeopardyData.json()

    // Get a random show, fiter into round, then categories
    const showData = _.groupBy(jeopardyData, 'showNumber')
    const randomShow = _.sample(showData)
    let dataByRound = _.groupBy(randomShow, 'round')["Jeopardy!"]
    let dataByCategory = _.groupBy(dataByRound, 'category')

    // Debug Stuff
    // console.log("DATA BY CAT:")
    // console.log(dataByCategory)

    // Save question set and set categories
    questions = dataByCategory
    for (let i = 0; i < 5; i++) {
        categories.push(Object.keys(dataByCategory)[i])
    }

    updateScore()
    buildGrid(gridHeight, gridWidth)
}

// --- Build Grid ---
function buildGrid(rows, columns) {

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < columns; j++) {

            const isCategory = !i
            const itemText = isCategory ? categories[j] : "$" + prizes[i - 1];
            const gridClass = 'grid-item ' + (isCategory ? 'grid-category' : `grid-question`);

            const grid_item = $(`
            <div class="${gridClass} item-${i} category-${j + 1}">
                <div class="grid-content">
                    ${itemText}
                </div>
            </div>
            `)

            grid.append(grid_item)

            if (i !== 0) {
                grid_item.on('click', () => {

                    let category = _.split(grid_item[0].classList[3], '-')[1] - 1
                    let question = _.split(grid_item[0].classList[2], '-')[1] - 1

                    // console.log("Category:", category, "Question:", question)

                    activeItem = grid_item
                    grid_item[0].classList.add("grid-active")
                    disableGrid()

                    getQuestion(category, question)

                })
            }

            gridItems = $(`.grid-item`)
        }
    }
}

// --- Utility Functions ---
function disableGrid() {
    gridItems.addClass('grid-disabled')
    toggleSubmit()
}

function enableGrid() {
    gridItems.removeClass('grid-disabled')
    toggleSubmit()
}

function toggleSubmit() {
    submit_btn.toggleClass('btn-enabled')
    submit_btn.toggleClass('btn-disabled')

    submit_text.toggleClass('input-enabled')
    submit_text.toggleClass('input-disabled')
}

function updateScore() {
    scoreTXT.innerText = `Your Score: $${score}`
    localStorage.setItem('score', score);
}

// --- Get Question ---
let activeQuestion = {}
let expectedAnswer = ""
let activePrize = 0

function getQuestion(category, question) {

    thisCategory = categories[category]
    thisQuestion = questions[thisCategory][question]
    activeQuestion = thisQuestion
    activePrize = (question + 1) * 200

    if (cheats === true) {
        console.log("Answer:", thisQuestion.answer)
    }

    questionTXT.innerText = thisQuestion.question
    expectedAnswer = _.toLower(thisQuestion.answer)
}

// --- User Input ---
form.on('submit', (input) => {
    input.preventDefault()
    if (submit_btn.hasClass("btn-enabled")) {
        let answer = _.toLower(input.target[0].value)
        _.isEqual(answer, expectedAnswer) ? answerQuestion('correct') : answerQuestion('incorrect');
    }
})

function answerQuestion(type) {
    if (type === 'correct') {
        score += activePrize
        questionTXT.innerText = "Correct!"
    } else {
        questionTXT.innerText = "Incorrect."
    }

    activeItem[0].classList.add("grid-answered")
    submit_text[0].value = ""

    updateScore()
    enableGrid()
}
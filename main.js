// --- Initialization ---

// --- Load Data ---

// deprecteed
let questionSet = []
loadData()

let questions = {}

// temp


let categories = []

const gridWidth = 5, gridHeight = 6

async function loadData() {

    // Get the jeopardy data from the JSON file
    const rawJeopardyData = await fetch('jeopardy.json')
    const jeopardyData = await rawJeopardyData.json()

    // Group the data by show
    const showData = _.groupBy(jeopardyData, 'showNumber')

    // Load a random show, filter into round, then categories
    const randomShow = questionSet = _.sample(showData)
    let dataByRound = _.groupBy(randomShow, 'round')["Jeopardy!"]
    let dataByCategory = _.groupBy(dataByRound, 'category')


    // Debug Stuff
    console.log("DATA BY CAT:")
    console.log(dataByCategory)

    // Save question set and set categories
    questions = dataByCategory
    for (let i = 0; i < 5; i++) {
        categories.push(Object.keys(dataByCategory)[i])
    }
 

    buildGrid(gridHeight, gridWidth)
};

// --- Build Grid ---

const grid = $('#grid')
const prizes = [200, 400, 600, 800, 1000]



function buildGrid(rows, columns) {

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < columns; j++) {


            let itemText = "Null"

            if (i === 0) {
                itemText = categories[j]
            } else {
                itemText = "$" + prizes[i - 1]
            }
            // each item needs: an ID of some kind

            let gridClass = 'grid-item'

            if (i === 0) {
                gridClass = 'grid-item grid-category'
            } else {
                gridClass = `grid-item grid-question`
            }

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

                    let category = _.split(grid_item[0].classList[3], '-')[1]
                    let question = _.split(grid_item[0].classList[2], '-')[1]

                    console.log("Category:", category, "Question:", question)

                })
            }
        }
    }
}


// --- Get Question ---


const questionTXT = $('#question')[0]

// 1,2,4,6,8

let activeQuestion = 0
let expectedAnswer = ''

// get jeopardy question based on num argument from array
function getQuestion(num) {

    activeQuestion = num

    let q = questionSet[num]

    console.log(q)

    questionTXT.innerText = q.question

    expectedAnswer = _.toLower(q.answer)

}




// --- User Input ---

const scoreTXT = $('#score')[0]
const form = $('#answerform')

form.on('submit', (input) => {
    input.preventDefault()
    let answer = _.toLower(input.target[0].value)

    if (_.isEqual(answer, expectedAnswer)) {
        console.log("Correct")
    } else {
        console.log("Incorrect")
    }

    console.log(answer)


})

function checkAnswer() {

}
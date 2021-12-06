// get grid
// populate grid items..
// but first get 25 grid items
// better yet, return # then call that from array...
// call func with params()

// --- Init ---

const grid = $('#grid')
const prizes = [100, 200, 400, 600, 800]

buildGrid(5)


function buildGrid(gridSize) {

    for (let i = 0; i < gridSize; i++) {

        let prize = prizes[i]

        for (let i = 0; i < gridSize; i++) {


            const grid_item = $(`
            <div class="grid-item">
                <div class="grid-content">
                    $${prize}
                </div>
            </div>
            `)

            grid.append(grid_item)

        }
    }
}

// --- User Input ---

// 1,2,4,6,8


// get jeopardy question based on num argument from array
function getQuestion(num) {

}
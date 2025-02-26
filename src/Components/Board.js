import React from 'react'

function Board({status}) {
    const {score, round} = status
    const roundNum = Array.from({length: round}, (_, index) => index + 1);
    const scoreNum = Array.from({length: score.length}, (_, index) => index + 1);
    return (
        <div>
            <img className={`board`} src="images/point_record_board_9.jpg" />
            {scoreNum.map((num, index) => <img key={index} className={`marker-score-${num}`} src={score[num-1]? "images/marker_score_success.png":"images/marker_score_fail.png"} />)}
            {roundNum.map((num, index) => (<img key={index} className={`marker-round-${num}`} src="images/marker_round.png" />))}
        </div>
    )
}

export default Board

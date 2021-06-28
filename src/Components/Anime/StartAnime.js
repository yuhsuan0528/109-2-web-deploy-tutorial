import "./anime.css";
import ReactAnime from 'react-animejs';
const {Anime, stagger} = ReactAnime;

const StartAnime = () => {
	var ml4 = {};
  ml4.opacityIn = [0,1];
  ml4.scaleIn = [0.2, 1];
  ml4.scaleOut = 3;
  ml4.durationIn = 700;
  ml4.durationOut = 500;
  ml4.delay = 400;

  return (
  <>
    <Anime
      initial={[
        { //1st segment
          targets: '.ml4 .letters-1',
          opacity: ml4.opacityIn,
          scale: ml4.scaleIn,
          duration: ml4.durationIn
        },
        { //2nd
          targets: '.ml4 .letters-1',
          opacity: 0,
          scale: ml4.scaleOut,
          duration: ml4.durationOut,
          easing: "easeInExpo",
          delay: ml4.delay
        },
        { //3rd
          targets: '.ml4 .letters-2',
          opacity: ml4.opacityIn,
          scale: ml4.scaleIn,
          duration: ml4.durationIn
        },{
          targets: '.ml4 .letters-2',
          opacity: 0,
          scale: ml4.scaleOut,
          duration: ml4.durationOut,
          easing: "easeInExpo",
          delay: ml4.delay
        },
        {
          targets: '.ml4 .letters-3',
          opacity: ml4.opacityIn,
          scale: ml4.scaleIn,
          duration: ml4.durationIn
        },
        {
          targets: '.ml4 .letters-3',
          opacity: 0,
          scale: ml4.scaleOut,
          duration: ml4.durationOut,
          easing: "easeInExpo",
          delay: ml4.delay
        },
        {
          targets: '.ml4',
          opacity: 0,
          duration: 500,
          delay: 500
        }
      ]}
    >
    <h1 className="ml4">
      <span className="letters letters-1">Ready</span>
      <span className="letters letters-2">Set</span>
      <span className="letters letters-3">Go!</span>
    </h1>
    </Anime>
  </>
  )
}

export default StartAnime;
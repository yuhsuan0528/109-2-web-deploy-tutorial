import "./anime.css";
import ReactAnime from 'react-animejs';
const {Anime} = ReactAnime;

const BadVictoryAnime = () => {
  
  return (
  <>
    <Anime
      initial={[
        { //1st segment
           targets: '.ml15 .word',
            scale: [14,1],
            opacity: [0,1],
            easing: "easeOutCirc",
            duration: 800,
            delay: (el, i) => 800 * i
        },
        { //2nd
           targets: '.ml15',
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        },
      ]}
    >
    <h1 class="ml15">
      <span class="word">壞人陣營</span>
      <span class="word">獲勝!</span>
    </h1>
    </Anime>
  </>
  )
}

export default BadVictoryAnime;
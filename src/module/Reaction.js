/*

  Класс Игра на реакцию

  // -> - статический метод
  // <- - частный метод

*/

export default class Reaction {

  /* ===========================
   *    Статические методы     *
   ============================*/

  // > Случайное число (min,max включительно) <
  static getRandom(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // > Показать элемент <
  static show($el){
    $el.classList.remove('hide');
  }

  // > Скрыть элемент <
  static hide($el){
    $el.classList.add('hide');
  }


  /* ===========================
   *        Конструктор        *
   ============================*/

  constructor() {
    this.$start = document.querySelector('#start');
    this.$game = document.querySelector('#game');
    this.$time = document.querySelector('#time');
    this.$result = document.querySelector('#result');
    this.$timeHeader = document.querySelector('#time-header');
    this.$timeResult = document.querySelector('#result-header');
    this.$gameTime = document.querySelector('#game-time');
    this.score = 0; // счетчик склько раз кликнули на квадрат
    this.isGameStarted = false; // переключатель (по умолчанию игра не запущена)
    this.colorsBox = ['red', 'green','blue','yellow','black','pink','brown','orange'];
  }


  /* ===========================
   *      Публичные методы     *
   ============================*/

  // > Точка входа <
  appReaction(){

    // вешаем события клика на кнопку "Начать"
    this.$start.addEventListener("click", () => {

      this.#startGame(); // <- запускает игру

    });

    // вешаем события клика на класс "game" на квадрат через делегирования
    this.$game.addEventListener("click", (evt) => {

      if(evt.target.dataset.box){

        this.#handleBoxClick(); // <- перезаписывает квадрат

      }

    });

    // вешаем события ввода на id "game-time"
    this.$gameTime.addEventListener("input", () => {

      this.#setGameTime(); // <- задает время игры

    });

  }


  /* ===========================
   *       Частный методы      *
   ============================*/

  // > Запускает игру <
  #startGame(){

    this.score = 0;
    this.isGameStarted = true;

    this.#setGameTime(); // <- задает время игры

    this.$gameTime.setAttribute('disabled','true')

    this.$game.style.backgroundColor = '#fff';
    this.$start.classList.add('hide');

    // секундомер
    let interval = setInterval(() =>{

      let time = parseFloat(this.$time.innerText);

      if (time <= 0){

        clearInterval(interval);

        this.#endGame(); // <- останавливает игру

      }else {
        this.$time.innerText = (time - 0.1).toFixed(1);
      }

    },100)

    this.#renderBox(); // <- рисует квадрат
  }

  // > Конец игры <
  #endGame(){

    this.isGameStarted = false;

    this.#setGameScore(); // <- показывает результат

    this.$gameTime.removeAttribute('disabled');

    this.$game.innerHTML = '';
    this.$game.style.backgroundColor = '#ccc';

    Reaction.show(this.$start); // -> показать элемент
    Reaction.hide(this.$timeHeader); // -> скрыть элемент
    Reaction.show(this.$timeResult); // -> показать элемент

  }

  // > Время игры <
  #setGameTime(){

    let time = +this.$gameTime.value;

    this.$time.innerText = time.toFixed(1);

    Reaction.show(this.$timeHeader); // -> показать элемент
    Reaction.hide(this.$timeResult); // -> скрыть элемент

  }

  // > Выводит результат игры <
  #setGameScore(){

    this.$result.innerText = this.score;

  }

  // > Перезаписывает квадрат и обновляет счетчик <
  #handleBoxClick(){

    if(!this.isGameStarted){

      return false;

    }

    this.score++;

    this.#renderBox(); // <- рисует квадрат

  }

  // > Рисует квадраты <
  #renderBox(){

    // очищаем вид с классом game
    this.$game.innerHTML = '';

    let box = document.createElement('div');
    let boxSize = Reaction.getRandom(30,100); // -> ширина и высота квадрата
    let gameSize = this.$game.getBoundingClientRect(); // параметры полотна для игры
    let maxTop = gameSize.height - boxSize; // наксимальное смешения квадрата в вниз
    let maxLeft = gameSize.width - boxSize;// наксимальное смешения квадрата в лево

    box.style.height = box.style.width = `${boxSize}px`;
    box.style.position = 'absolute';
    box.style.backgroundColor = `${this.colorsBox[Reaction.getRandom(0,this.colorsBox.length -1)]}`;
    box.style.top = `${Reaction.getRandom(0,maxTop)}px`; // -> координаты с верху
    box.style.left = `${Reaction.getRandom(0,maxLeft)}px`; // -> координаты с лева
    box.style.cursor = 'pointer';
    box.setAttribute('data-box','true');

    this.$game.insertAdjacentElement('afterbegin', box);

  }

}

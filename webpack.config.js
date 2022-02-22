const HtmlWebpackPlugin = require('html-webpack-plugin'); // Устанавливаем плагин "html-webpack-plugin" - создает HTML-файлы
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Устанавливаем плагин "mini-css-extract-plugin" - экспортирует CSS в отдельный фаил

let mode = 'development'; // development (для разработки) | production (все максимально оптимизировано)

if (process.env.NODE_ENV === 'production') {  // если системная переменная равна production

  mode = 'production'; // то свойство mode перезаписываем в значения production

}

console.log(`Проект собирается в режиме: ${mode}`) // сообщает в консось в каком режиме собирается проект

module.exports = {

  /* свойство Mode - хранит режим разработки */
  mode: mode,

  /* свойство Entry - вдохные фаилы нашего приложения */
  entry: {
    build: './src/index.js', // фаил index будет переименован build.js
    // user: './src/user.js', // если надо 2 файл просто дабавте его таким образом ключ : путь
  },

  /* свойство Output - пути выхода */
  output: {

    clean: true, // очищает папку dist перед сборкой проекта
    filename: 'assets/js/[name].[contenthash].js',  // названия файла который должен получится в резульнате работы webpack
    // assetModuleFilename: "assets/[hash][ext][query]", // задает выходной путь для всего статический контента

  },

  /* свойство Plugins - здесь вызываются и настраиваются плагины */
  plugins: [

    /* Так как все плагины являются классам, мы создаем экземпляр класса */

    // создаем экземпляр класса "HtmlWebpackPlugin"
    new HtmlWebpackPlugin({

      template: "./src/html/index.html"  // путь к входному файлу (шаблону)

    }),

    // создаем экземпляр класса "MiniCssExtractPlugin"
    new MiniCssExtractPlugin({

      filename: 'assets/css/style.[contenthash].css' // имя файла на выходе (попадет в dist)

    })

  ],

  /* свойство Module - здесь вызываются и настраиваются лоудеры */
  module: {

    rules: [

      // Обработчик 1: Подключаем шаблонизатор Pug
      {
        test: /\.pug$/, // расширения файлов на которых будет влиять loader
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "pug-loader",
            options: {
              pretty: true
            }
          }
        ]
      },

      // Обработчик 2: Выдергивает картинки из Html и складывает в папку assets
      {
        test: /\.html$/i,
        loader: "html-loader",
        generator: {
          filename: 'assets/img/[hash][ext][query]' // указываем папку куда складывать картинки
        }
      },

      // Обработчик 3: ( для CSS | SASS | SCSS ) css-loader - подгружает css как модуль | style-loader вставляет стили в index.html
      {

        test: /\.(sa|sc|c)ss$/, // расширения файлов на которых будет влиять loader
        use: [
          (mode === 'development') ? "style-loader" : MiniCssExtractPlugin.loader, // если режим development: вставляем стили в код html, иначе в отдельный фаил
          "css-loader", // импортирует как модуль в index.js
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          }, // вставляет автопрефиксы
          "sass-loader",  // компелирует Scss в Css
        ]
      },

      // Обработчик 4: ( для png | svg | jpg | jpeg | gif ) выдергивает картинки из стилий и складывает в папку assets
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[hash][ext][query]' // указываем папку куда складывать картинки
        }
      },

      // Обработчик 5: ( woff | woff2 | eot | ttf | otf ) берет шрифты из стилий и складывает в папку assets
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]' // указываем папку куда складывать шрифты
        }
      },

      // Обработчик 6: ( ДЛЯ JS ) компелирует ES6 в ES5
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }

    ]

  },

  /* свойство Optimization - раздел оптимизации */
  optimization: {
    splitChunks: {  // вырезает jQuery и подключает отдельным файлом
      chunks: 'all'
    }
  },

  /* свойство Devtool - подключаем исходные карты */
  devtool: 'source-map',

  /* свойство devServer - разварачивает локальный сервер */
  devServer: {

    open: true, // открывает вкладку в браузере
    watchFiles: ['src/**/*'], // откуда смотреть

  },

}

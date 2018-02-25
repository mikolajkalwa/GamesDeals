# dealsBot

Bot informuje o darmowych gierkach. Jako swoje źródło traktuje reddita `/r/GameDeals`

## Jak uruchomić?

Pobierasz node.js, uzupełniasz `config.example.js` i zmieniasz jego nazwę na `config.js`

Później w konsoli nawigujesz przy użyciu `cd` do folderu z botem i wpisujesz `node app.js`

MAGIA!

W głównym folderze musi zostać utworzony folder `logs`, bo inaczej wszystko przestaje działać, bo głupi logger nie potrafi utworzyć sam sobie folderu, a ja narazie nie znalazłem innego rozwiązania.
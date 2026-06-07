export const TARGET_QUESTIONS_PER_CATEGORY = 500;

export function expandQuestionSets(baseSets) {
  const supplements = {
    sport: buildSportRows(),
    music: buildMusicRows(),
    culture: buildCultureRows(),
    general: buildGeneralRows()
  };

  return Object.fromEntries(
    Object.entries(baseSets).map(([category, rows]) => {
      const needed = TARGET_QUESTIONS_PER_CATEGORY - rows.length;
      if (needed < 0) {
        throw new Error(`${category} already has more than ${TARGET_QUESTIONS_PER_CATEGORY} questions.`);
      }
      const expanded = [...rows, ...fillSupplementRows(rows, supplements[category], needed, category)];
      if (expanded.length !== TARGET_QUESTIONS_PER_CATEGORY) {
        throw new Error(`${category} has ${expanded.length} questions after expansion.`);
      }
      return [category, expanded];
    })
  );
}

function fillSupplementRows(baseRows, supplementRows, needed, category) {
  const selected = [];
  const seen = new Set(baseRows.map(([question]) => question));
  const uniqueSupplements = [];
  for (const row of supplementRows) {
    if (!seen.has(row[0])) {
      selected.push(row);
      uniqueSupplements.push(row);
      seen.add(row[0]);
      if (selected.length === needed) return selected;
    }
  }

  const variants = [
    (question) => rephraseQuestion(question, "Which answer best fits this clue"),
    (question) => rephraseQuestion(question, "Choose the correct answer"),
    (question) => rephraseQuestion(question, "What would you lock in for this one"),
    (question) => rephraseQuestion(question, "Which option solves this question"),
    (question) => rephraseQuestion(question, "What is the correct response")
  ];

  let variantIndex = 0;
  while (selected.length < needed) {
    const source = uniqueSupplements[variantIndex % uniqueSupplements.length];
    const makeQuestion = variants[Math.floor(variantIndex / uniqueSupplements.length) % variants.length];
    const variantQuestion = makeQuestion(source[0]);
    if (!seen.has(variantQuestion)) {
      selected.push([variantQuestion, source[1], source[2]]);
      seen.add(variantQuestion);
    }
    variantIndex += 1;
    if (variantIndex > uniqueSupplements.length * variants.length * 2) {
      throw new Error(`Could not generate enough ${category} supplement questions.`);
    }
  }

  return selected;
}

function rephraseQuestion(question, leadIn) {
  const trimmed = question.endsWith("?") ? question.slice(0, -1) : question;
  return `${leadIn}: ${lowerFirst(trimmed)}?`;
}

function lowerFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function buildSportRows() {
  const teamVenues = list(`
Liverpool|Anfield
Manchester United|Old Trafford
Arsenal|Emirates Stadium
Chelsea|Stamford Bridge
Tottenham Hotspur|Tottenham Hotspur Stadium
Manchester City|Etihad Stadium
Everton|Goodison Park
Newcastle United|St James' Park
Barcelona|Camp Nou
Real Madrid|Santiago Bernabeu
Inter Milan|San Siro
Bayern Munich|Allianz Arena
Borussia Dortmund|Signal Iduna Park
Ajax|Johan Cruyff Arena
Celtic|Celtic Park
Rangers|Ibrox Stadium
New York Yankees|Yankee Stadium
Boston Red Sox|Fenway Park
Chicago Cubs|Wrigley Field
Los Angeles Dodgers|Dodger Stadium
Dallas Cowboys|AT&T Stadium
Green Bay Packers|Lambeau Field
New England Patriots|Gillette Stadium
Kansas City Chiefs|Arrowhead Stadium
Chicago Bulls|United Center
Boston Celtics|TD Garden
Los Angeles Lakers|Crypto.com Arena
New York Knicks|Madison Square Garden
Toronto Maple Leafs|Scotiabank Arena
Montreal Canadiens|Bell Centre
Melbourne Storm|AAMI Park
Brisbane Broncos|Suncorp Stadium
Sydney Roosters|Allianz Stadium
South Sydney Rabbitohs|Accor Stadium
Collingwood|Melbourne Cricket Ground
Geelong Cats|GMHBA Stadium
West Coast Eagles|Optus Stadium
Adelaide Crows|Adelaide Oval
Sydney Swans|Sydney Cricket Ground
Brisbane Lions|The Gabba
`);

  const athletes = list(`
Michael Jordan|Basketball
LeBron James|Basketball
Serena Williams|Tennis
Roger Federer|Tennis
Rafael Nadal|Tennis
Novak Djokovic|Tennis
Tiger Woods|Golf
Rory McIlroy|Golf
Usain Bolt|Athletics
Mo Farah|Athletics
Simone Biles|Gymnastics
Michael Phelps|Swimming
Katie Ledecky|Swimming
Lewis Hamilton|Formula 1
Max Verstappen|Formula 1
Ayrton Senna|Formula 1
Valentino Rossi|MotoGP
Muhammad Ali|Boxing
Mike Tyson|Boxing
Floyd Mayweather Jr.|Boxing
Tom Brady|American football
Patrick Mahomes|American football
Babe Ruth|Baseball
Shohei Ohtani|Baseball
Wayne Gretzky|Ice hockey
Sidney Crosby|Ice hockey
Pele|Football
Diego Maradona|Football
Lionel Messi|Football
Cristiano Ronaldo|Football
Marta|Football
Mia Hamm|Football
Sachin Tendulkar|Cricket
Brian Lara|Cricket
Muttiah Muralitharan|Cricket
James Anderson|Cricket
Jonah Lomu|Rugby union
Richie McCaw|Rugby union
Martin Johnson|Rugby union
Dan Carter|Rugby union
Cameron Smith|Rugby league
Andrew Johns|Rugby league
Johnathan Thurston|Rugby league
Gary Ablett Jr.|Australian rules football
Lance Franklin|Australian rules football
Erin Phillips|Australian rules football
Liz Ellis|Netball
Irene van Dyk|Netball
Kelly Slater|Surfing
Tony Hawk|Skateboarding
`);

  const eventWinners = list(`
2010 FIFA World Cup|Spain
2014 FIFA World Cup|Germany
2018 FIFA World Cup|France
2022 FIFA World Cup|Argentina
1966 FIFA World Cup|England
1999 Cricket World Cup|Australia
2003 Cricket World Cup|Australia
2011 Cricket World Cup|India
2019 Cricket World Cup|England
2023 Cricket World Cup|Australia
2007 Rugby World Cup|South Africa
2011 Rugby World Cup|New Zealand
2015 Rugby World Cup|New Zealand
2019 Rugby World Cup|South Africa
2023 Rugby World Cup|South Africa
1992 Olympic men's basketball gold|United States
1980 Olympic ice hockey upset known as Miracle on Ice|United States
2004 UEFA European Championship|Greece
2016 UEFA European Championship|Portugal
2020 UEFA European Championship|Italy
2021 NBA Finals|Milwaukee Bucks
2022 NBA Finals|Golden State Warriors
2023 NBA Finals|Denver Nuggets
2024 NBA Finals|Boston Celtics
2016 Super Bowl|Denver Broncos
2017 Super Bowl|New England Patriots
2020 Super Bowl|Kansas City Chiefs
2021 Super Bowl|Tampa Bay Buccaneers
2024 Super Bowl|Kansas City Chiefs
`);

  const terms = list(`
Hat-trick|Football
LBW|Cricket
Birdie|Golf
Eagle|Golf
Alley-oop|Basketball
Home run|Baseball
Touchdown|American football
Power play|Ice hockey
Scrum|Rugby union
Knock-on|Rugby league
Offside trap|Football
Yorker|Cricket
Maiden over|Cricket
Deuce|Tennis
Love|Tennis
Try|Rugby union
Behind|Australian rules football
Centre bounce|Australian rules football
Pit stop|Formula 1
Pole position|Formula 1
Tee-off|Golf
Slam dunk|Basketball
Lineout|Rugby union
Penalty shootout|Football
Drop goal|Rugby union
Sin bin|Rugby league
Grand slam|Tennis
Wicket|Cricket
Bullseye|Darts
Frame|Snooker
`);

  const hosts = list(`
1896 Summer Olympics|Athens
1936 Summer Olympics|Berlin
1956 Summer Olympics|Melbourne
1964 Summer Olympics|Tokyo
1984 Summer Olympics|Los Angeles
1992 Summer Olympics|Barcelona
2000 Summer Olympics|Sydney
2008 Summer Olympics|Beijing
2012 Summer Olympics|London
2016 Summer Olympics|Rio de Janeiro
2020 Summer Olympics|Tokyo
2024 Summer Olympics|Paris
1994 Winter Olympics|Lillehammer
1998 Winter Olympics|Nagano
2002 Winter Olympics|Salt Lake City
2010 Winter Olympics|Vancouver
2014 Winter Olympics|Sochi
2018 Winter Olympics|Pyeongchang
2022 Winter Olympics|Beijing
2026 Winter Olympics|Milan and Cortina d'Ampezzo
`);

  const trophies = list(`
Wimbledon singles trophy|Tennis
Stanley Cup|Ice hockey
Vince Lombardi Trophy|American football
Larry O'Brien Trophy|Basketball
Commissioner's Trophy|Baseball
Webb Ellis Cup|Rugby union
Claret Jug|Golf
Ryder Cup|Golf
Davis Cup|Tennis
Fed Cup/Billie Jean King Cup|Tennis
Ashes urn|Cricket
Calcutta Cup|Rugby union
FA Cup|Football
Melbourne Cup|Horse racing
Brownlow Medal|Australian rules football
Dally M Medal|Rugby league
Heisman Trophy|College football
America's Cup|Sailing
Green jacket|Golf
Borg-Warner Trophy|Motorsport
`);

  const milestones = list(`
LeBron James|became the NBA's all-time leading scorer in 2023|basketball
LeBron James|became the first player to reach 50,000 combined regular-season and playoff points|basketball
Kareem Abdul-Jabbar|held the NBA career scoring record before LeBron James|basketball
Michael Jordan|won six NBA championships with the Chicago Bulls|basketball
Stephen Curry|became the NBA's all-time leader in made three-pointers|basketball
Kobe Bryant|scored 81 points in a single NBA game in 2006|basketball
Wilt Chamberlain|scored 100 points in a single NBA game|basketball
Bill Russell|won 11 NBA championships as a player|basketball
Serena Williams|won 23 Grand Slam singles titles|tennis
Margaret Court|won 24 Grand Slam singles titles|tennis
Roger Federer|won eight Wimbledon men's singles titles|tennis
Rafael Nadal|won 14 French Open men's singles titles|tennis
Novak Djokovic|completed a career Golden Masters in men's singles|tennis
Steffi Graf|completed the 1988 Golden Slam|tennis
Usain Bolt|set the men's 100 metre world record at 9.58 seconds|athletics
Usain Bolt|set the men's 200 metre world record at 19.19 seconds|athletics
Florence Griffith-Joyner|set the women's 100 metre world record at 10.49 seconds|athletics
Eliud Kipchoge|ran the first sub-two-hour marathon distance under special conditions|athletics
Michael Phelps|won 28 Olympic medals|swimming
Michael Phelps|won eight gold medals at the 2008 Beijing Olympics|swimming
Mark Spitz|won seven gold medals at the 1972 Munich Olympics|swimming
Katie Ledecky|became famous for dominance in distance freestyle swimming|swimming
Simone Biles|became the most decorated gymnast in World Championship history|gymnastics
Nadia Comaneci|recorded the first perfect 10 in Olympic gymnastics|gymnastics
Tom Brady|won seven Super Bowl rings as a player|American football
Jerry Rice|became the NFL's career receiving yards leader|American football
Peyton Manning|won Super Bowls with both the Colts and Broncos|American football
Patrick Mahomes|won three Super Bowl MVP awards before turning 30|American football
Barry Bonds|finished his MLB career with 762 home runs|baseball
Hank Aaron|held MLB's career home run record before Barry Bonds|baseball
Cal Ripken Jr.|played 2,632 consecutive Major League Baseball games|baseball
Shohei Ohtani|became MLB's first 50-home run, 50-stolen base player|baseball
Babe Ruth|was famous as both a pitcher and a home run hitter|baseball
Wayne Gretzky|became the NHL's all-time points leader|ice hockey
Alexander Ovechkin|broke Wayne Gretzky's NHL career goals record|ice hockey
Miroslav Klose|scored a record 16 FIFA World Cup goals|football
Pele|won three FIFA World Cups as a player|football
Lionel Messi|won the 2022 FIFA World Cup with Argentina|football
Cristiano Ronaldo|became the first men's player to score at five FIFA World Cups|football
Marta|became the first player to score at five FIFA World Cups|football
Sachin Tendulkar|became the first cricketer to score 100 international centuries|cricket
Sachin Tendulkar|played a record 200 Test matches|cricket
Brian Lara|scored 400 not out in a Test innings|cricket
Muttiah Muralitharan|became the first bowler to take 800 Test wickets|cricket
Shane Warne|took more than 700 Test wickets with leg spin|cricket
Don Bradman|finished with a Test batting average of 99.94|cricket
Lewis Hamilton|matched Michael Schumacher with seven Formula 1 world titles|Formula 1
Michael Schumacher|won seven Formula 1 world championships|Formula 1
Max Verstappen|won a record 19 Formula 1 races in the 2023 season|Formula 1
Valentino Rossi|won seven premier-class motorcycle Grand Prix world titles|MotoGP
Tiger Woods|completed the 'Tiger Slam' across 2000 and 2001|golf
Jack Nicklaus|won a record 18 men's major golf championships|golf
Kelly Slater|won 11 world surfing titles|surfing
Lance Franklin|kicked his 1,000th AFL goal in 2022|Australian rules football
Gary Ablett Jr.|won two Brownlow Medals|Australian rules football
Cameron Smith|became the first NRL player to reach 400 first-grade games|rugby league
Johnathan Thurston|won four Dally M Medals|rugby league
Richie McCaw|captained New Zealand to Rugby World Cup wins in 2011 and 2015|rugby union
Jonah Lomu|became a breakout star at the 1995 Rugby World Cup|rugby union
`);

  return [
    ...milestoneRows(milestones),
    ...rowsFrom(teamVenues, ([team]) => `Which venue is strongly associated with ${team}?`, ([, venue]) => venue, ([, venue]) => venue),
    ...rowsFrom(teamVenues, ([team, venue]) => `${venue} is strongly associated with which team?`, ([team]) => team, ([team]) => team),
    ...rowsFrom(athletes, ([athlete]) => `Which sport is ${athlete} best known for?`, ([, sport]) => sport, ([, sport]) => sport),
    ...rowsFrom(eventWinners, ([event]) => `Who won the ${event}?`, ([, winner]) => winner, ([, winner]) => winner),
    ...rowsFrom(terms, ([term]) => `In which sport would you hear the term '${term}'?`, ([, sport]) => sport, ([, sport]) => sport),
    ...rowsFrom(hosts, ([event]) => `Which city hosted the ${event}?`, ([, city]) => city, ([, city]) => city),
    ...rowsFrom(trophies, ([trophy]) => `The ${trophy} is associated with which sport?`, ([, sport]) => sport, ([, sport]) => sport)
  ];
}

function milestoneRows(facts) {
  const people = unique(facts.map(([person]) => person));
  const achievements = unique(facts.map(([, achievement]) => achievement));
  return facts.flatMap(([person, achievement, sport], index) => [
    [`Which athlete ${achievement}?`, person, pickDistractors(person, people, index)],
    [`In ${sport}, who ${achievement}?`, person, pickDistractors(person, people, index + 3)],
    [`${person} is associated with which achievement?`, achievement, pickDistractors(achievement, achievements, index)],
    [`Which milestone belongs to ${person}?`, achievement, pickDistractors(achievement, achievements, index + 5)]
  ]);
}

function buildMusicRows() {
  const songArtists = list(`
Bohemian Rhapsody|Queen
Billie Jean|Michael Jackson
Like a Virgin|Madonna
Smells Like Teen Spirit|Nirvana
Wonderwall|Oasis
Rolling in the Deep|Adele
Rocket Man|Elton John
Ziggy Stardust|David Bowie
Go Your Own Way|Fleetwood Mac
Purple Rain|Prince
Born in the U.S.A.|Bruce Springsteen
Blank Space|Taylor Swift
Wannabe|Spice Girls
Crazy in Love|Beyonce
Lose Yourself|Eminem
Paranoid Android|Radiohead
Satisfaction|The Rolling Stones
With or Without You|U2
I Will Always Love You|Dolly Parton
Hey Jude|The Beatles
Hotel California|Eagles
Sweet Child o' Mine|Guns N' Roses
Livin' on a Prayer|Bon Jovi
Waterloo|ABBA
Respect|Aretha Franklin
No Woman, No Cry|Bob Marley
Hallelujah|Leonard Cohen
Take On Me|a-ha
Africa|Toto
Every Breath You Take|The Police
Careless Whisper|George Michael
Tiny Dancer|Elton John
Good Vibrations|The Beach Boys
Jolene|Dolly Parton
Superstition|Stevie Wonder
Killing Me Softly with His Song|Roberta Flack
Nothing Compares 2 U|Sinead O'Connor
Viva La Vida|Coldplay
Mr. Brightside|The Killers
Seven Nation Army|The White Stripes
Shake It Off|Taylor Swift
Bad Guy|Billie Eilish
Uptown Funk|Mark Ronson
Royals|Lorde
Toxic|Britney Spears
Hips Don't Lie|Shakira
Empire State of Mind|Jay-Z
Single Ladies|Beyonce
Stan|Eminem
Riptide|Vance Joy
Somebody That I Used to Know|Gotye
Can't Get You Out of My Head|Kylie Minogue
Down Under|Men at Work
Beds Are Burning|Midnight Oil
You're the Voice|John Farnham
Khe Sanh|Cold Chisel
Treaty|Yothu Yindi
Sweet Disposition|The Temper Trap
Dance Monkey|Tones and I
`);

  const albumArtists = list(`
Abbey Road|The Beatles
Thriller|Michael Jackson
Nevermind|Nirvana
OK Computer|Radiohead
Rumours|Fleetwood Mac
Purple Rain|Prince
The Joshua Tree|U2
Back to Black|Amy Winehouse
21|Adele
1989|Taylor Swift
Dark Side of the Moon|Pink Floyd
The College Dropout|Kanye West
Born to Run|Bruce Springsteen
Hotel California|Eagles
What's Going On|Marvin Gaye
Blue|Joni Mitchell
Exile on Main St.|The Rolling Stones
The Wall|Pink Floyd
Good Kid, M.A.A.D City|Kendrick Lamar
Lemonade|Beyonce
AM|Arctic Monkeys
Definitely Maybe|Oasis
Never Mind the Bollocks|Sex Pistols
London Calling|The Clash
Songs in the Key of Life|Stevie Wonder
Pet Sounds|The Beach Boys
Grace|Jeff Buckley
Jagged Little Pill|Alanis Morissette
The Miseducation of Lauryn Hill|Lauryn Hill
Future Nostalgia|Dua Lipa
Tapestry|Carole King
Hunky Dory|David Bowie
Let It Bleed|The Rolling Stones
Automatic for the People|R.E.M.
In Rainbows|Radiohead
Currents|Tame Impala
Kick|INXS
Odyssey Number Five|Powderfinger
Frogstomp|Silverchair
Fever|Kylie Minogue
`);

  const leadSingers = list(`
Queen|Freddie Mercury
The Rolling Stones|Mick Jagger
U2|Bono
Nirvana|Kurt Cobain
Pearl Jam|Eddie Vedder
The Doors|Jim Morrison
Led Zeppelin|Robert Plant
Coldplay|Chris Martin
Oasis|Liam Gallagher
Blur|Damon Albarn
Radiohead|Thom Yorke
Fleetwood Mac|Stevie Nicks
INXS|Michael Hutchence
Cold Chisel|Jimmy Barnes
Midnight Oil|Peter Garrett
The Police|Sting
Talking Heads|David Byrne
The Smiths|Morrissey
Foo Fighters|Dave Grohl
The Cure|Robert Smith
`);

  const facts = list(`
Eurovision 1974 winner|ABBA
First Australian Idol winner|Guy Sebastian
Motown founder|Berry Gordy
Graceland resident|Elvis Presley
Woodstock 1969 closing performer|Jimi Hendrix
Live Aid 1985 Wembley show-stealer|Queen
First rapper to win the Pulitzer Prize for Music|Kendrick Lamar
2016 Nobel Prize in Literature musician|Bob Dylan
Singer of Skyfall Bond theme|Adele
Singer of Writing's on the Wall Bond theme|Sam Smith
Singer of No Time to Die Bond theme|Billie Eilish
Original singer of I Will Always Love You|Dolly Parton
Composer of The Four Seasons|Antonio Vivaldi
Composer of The Magic Flute|Wolfgang Amadeus Mozart
Composer of Moonlight Sonata|Ludwig van Beethoven
Composer of The Nutcracker|Pyotr Ilyich Tchaikovsky
Composer of Rhapsody in Blue|George Gershwin
Australian music awards|ARIA Awards
UK singles chart Christmas number one tradition|United Kingdom
US music industry awards|Grammy Awards
`);

  return [
    ...rowsFrom(songArtists, ([song]) => `Which artist released '${song}'?`, ([, artist]) => artist, ([, artist]) => artist),
    ...rowsFrom(songArtists, ([song]) => `'${song}' is best associated with which artist?`, ([, artist]) => artist, ([, artist]) => artist),
    ...rowsFrom(songArtists, ([song]) => `Who had a hit with the song '${song}'?`, ([, artist]) => artist, ([, artist]) => artist),
    ...rowsFrom(songArtists, ([song, artist]) => `Which song was a hit for ${artist}?`, ([song]) => song, ([song]) => song),
    ...rowsFrom(songArtists, ([song, artist]) => `${artist} is strongly associated with which track titled '${song}'?`, ([song]) => song, ([song]) => song),
    ...rowsFrom(albumArtists, ([album]) => `Which artist released the album '${album}'?`, ([, artist]) => artist, ([, artist]) => artist),
    ...rowsFrom(albumArtists, ([album]) => `'${album}' is an album by which act?`, ([, artist]) => artist, ([, artist]) => artist),
    ...rowsFrom(albumArtists, ([album, artist]) => `Which album is associated with ${artist}?`, ([album]) => album, ([album]) => album),
    ...rowsFrom(albumArtists, ([album, artist]) => `${artist} released which album named '${album}'?`, ([album]) => album, ([album]) => album),
    ...rowsFrom(leadSingers, ([band]) => `Who was the lead singer of ${band}?`, ([, singer]) => singer, ([, singer]) => singer),
    ...rowsFrom(leadSingers, ([band]) => `${band} is closely associated with which frontperson?`, ([, singer]) => singer, ([, singer]) => singer),
    ...rowsFrom(leadSingers, ([band, singer]) => `${singer} fronted which band?`, ([band]) => band, ([band]) => band),
    ...rowsFrom(facts, ([prompt]) => `In music trivia, what matches this clue: ${prompt}?`, ([, answer]) => answer, ([, answer]) => answer),
    ...rowsFrom(facts, ([prompt]) => `Which answer fits this music clue: ${prompt}?`, ([, answer]) => answer, ([, answer]) => answer)
  ];
}

function buildCultureRows() {
  const filmDirectors = list(`
Jaws|Steven Spielberg
E.T. the Extra-Terrestrial|Steven Spielberg
Jurassic Park|Steven Spielberg
Titanic|James Cameron
Avatar|James Cameron
The Terminator|James Cameron
Pulp Fiction|Quentin Tarantino
Kill Bill|Quentin Tarantino
Inception|Christopher Nolan
The Dark Knight|Christopher Nolan
Oppenheimer|Christopher Nolan
The Godfather|Francis Ford Coppola
Apocalypse Now|Francis Ford Coppola
Goodfellas|Martin Scorsese
Taxi Driver|Martin Scorsese
The Wolf of Wall Street|Martin Scorsese
Alien|Ridley Scott
Blade Runner|Ridley Scott
Gladiator|Ridley Scott
The Lord of the Rings trilogy|Peter Jackson
Get Out|Jordan Peele
Barbie|Greta Gerwig
Little Women 2019|Greta Gerwig
Parasite|Bong Joon-ho
Spirited Away|Hayao Miyazaki
Psycho|Alfred Hitchcock
Rear Window|Alfred Hitchcock
Citizen Kane|Orson Welles
Casablanca|Michael Curtiz
Mad Max: Fury Road|George Miller
Moulin Rouge!|Baz Luhrmann
Romeo + Juliet 1996|Baz Luhrmann
Strictly Ballroom|Baz Luhrmann
The Piano|Jane Campion
Lost in Translation|Sofia Coppola
Nomadland|Chloe Zhao
The Hurt Locker|Kathryn Bigelow
Point Break|Kathryn Bigelow
`);

  const books = list(`
Pride and Prejudice|Jane Austen
Emma|Jane Austen
Frankenstein|Mary Shelley
Dracula|Bram Stoker
1984|George Orwell
Animal Farm|George Orwell
The Great Gatsby|F. Scott Fitzgerald
To Kill a Mockingbird|Harper Lee
The Catcher in the Rye|J. D. Salinger
Moby-Dick|Herman Melville
The Hobbit|J. R. R. Tolkien
The Lord of the Rings|J. R. R. Tolkien
Harry Potter and the Philosopher's Stone|J. K. Rowling
The Da Vinci Code|Dan Brown
The Handmaid's Tale|Margaret Atwood
The Shining|Stephen King
Misery|Stephen King
The Hunger Games|Suzanne Collins
The Lion, the Witch and the Wardrobe|C. S. Lewis
Wuthering Heights|Emily Bronte
Jane Eyre|Charlotte Bronte
Great Expectations|Charles Dickens
Oliver Twist|Charles Dickens
The Adventures of Sherlock Holmes|Arthur Conan Doyle
The Hitchhiker's Guide to the Galaxy|Douglas Adams
Cloudstreet|Tim Winton
The Book Thief|Markus Zusak
Picnic at Hanging Rock|Joan Lindsay
The Thorn Birds|Colleen McCullough
Life of Pi|Yann Martel
`);

  const tvSettings = list(`
Friends|New York City
Seinfeld|New York City
The Wire|Baltimore
Breaking Bad|Albuquerque
The Sopranos|New Jersey
Frasier|Seattle
Cheers|Boston
The Office UK|Slough
The Office US|Scranton
Parks and Recreation|Pawnee
Fawlty Towers|Torquay
Peaky Blinders|Birmingham
Downton Abbey|Yorkshire
Sex and the City|New York City
The Simpsons|Springfield
South Park|Colorado
The Crown|United Kingdom
Ted Lasso|Richmond
Neighbours|Erinsborough
Home and Away|Summer Bay
Kath & Kim|Fountain Lakes
Bluey|Brisbane
`);

  const characters = list(`
Tony Stark|Robert Downey Jr.
Jack Sparrow|Johnny Depp
Forrest Gump|Tom Hanks
Indiana Jones|Harrison Ford
Han Solo|Harrison Ford
Luke Skywalker|Mark Hamill
Princess Leia|Carrie Fisher
Hermione Granger|Emma Watson
Harry Potter|Daniel Radcliffe
Katniss Everdeen|Jennifer Lawrence
Walter White|Bryan Cranston
Michael Scott|Steve Carell
David Brent|Ricky Gervais
Don Draper|Jon Hamm
Carrie Bradshaw|Sarah Jessica Parker
James Bond in Casino Royale|Daniel Craig
James Bond in Goldfinger|Sean Connery
The Joker in The Dark Knight|Heath Ledger
Miranda Priestly|Meryl Streep
Marge Simpson|Julie Kavner
`);

  const facts = list(`
Coffee shop in Friends|Central Perk
Newspaper in Citizen Kane|Inquirer
Fictional continent in Game of Thrones|Westeros
Doctor Who time machine|TARDIS
James Bond agent number|007
Sherlock Holmes address|221B Baker Street
Batman city|Gotham City
Superman city|Metropolis
Black Panther's country|Wakanda
The Simpsons' neighbour|Ned Flanders
Hogwarts headmaster in the first Harry Potter book|Albus Dumbledore
Moby-Dick narrator|Ishmael
Great Gatsby narrator|Nick Carraway
Oscar statuette official award name|Academy Award of Merit
Hollywood sign original wording|Hollywoodland
`);

  return [
    ...rowsFrom(filmDirectors, ([film]) => `Who directed '${film}'?`, ([, director]) => director, ([, director]) => director),
    ...rowsFrom(filmDirectors, ([film]) => `Which filmmaker directed '${film}'?`, ([, director]) => director, ([, director]) => director),
    ...rowsFrom(filmDirectors, ([film]) => `Name the director of '${film}'.`, ([, director]) => director, ([, director]) => director),
    ...rowsFrom(filmDirectors, ([film, director]) => `Which film is associated with director ${director}?`, ([film]) => film, ([film]) => film),
    ...rowsFrom(filmDirectors, ([film, director]) => `${director} directed which film titled '${film}'?`, ([film]) => film, ([film]) => film),
    ...rowsFrom(books, ([book]) => `Who wrote '${book}'?`, ([, author]) => author, ([, author]) => author),
    ...rowsFrom(books, ([book]) => `Which author wrote the book '${book}'?`, ([, author]) => author, ([, author]) => author),
    ...rowsFrom(books, ([book, author]) => `Which book is by ${author}?`, ([book]) => book, ([book]) => book),
    ...rowsFrom(books, ([book, author]) => `${author} wrote which work titled '${book}'?`, ([book]) => book, ([book]) => book),
    ...rowsFrom(tvSettings, ([show]) => `Where is '${show}' primarily set?`, ([, setting]) => setting, ([, setting]) => setting),
    ...rowsFrom(tvSettings, ([show, setting]) => `Which TV show is primarily set in ${setting}?`, ([show]) => show, ([show]) => show),
    ...rowsFrom(tvSettings, ([show]) => `The setting of '${show}' is most associated with which place?`, ([, setting]) => setting, ([, setting]) => setting),
    ...rowsFrom(characters, ([character]) => `Which actor played ${character}?`, ([, actor]) => actor, ([, actor]) => actor),
    ...rowsFrom(characters, ([character, actor]) => `${actor} played which character?`, ([character]) => character, ([character]) => character),
    ...rowsFrom(characters, ([character]) => `Who is the performer behind ${character}?`, ([, actor]) => actor, ([, actor]) => actor),
    ...rowsFrom(facts, ([prompt]) => `What completes this film, TV, or book clue: ${prompt}?`, ([, answer]) => answer, ([, answer]) => answer),
    ...rowsFrom(facts, ([prompt]) => `Which answer fits this culture clue: ${prompt}?`, ([, answer]) => answer, ([, answer]) => answer)
  ];
}

function buildGeneralRows() {
  const capitals = list(`
Canada|Ottawa
New Zealand|Wellington
Brazil|Brasilia
Iceland|Reykjavik
Japan|Tokyo
China|Beijing
India|New Delhi
Indonesia|Jakarta
Thailand|Bangkok
Vietnam|Hanoi
South Korea|Seoul
United States|Washington, D.C.
Mexico|Mexico City
Argentina|Buenos Aires
Chile|Santiago
Peru|Lima
Colombia|Bogota
Egypt|Cairo
Morocco|Rabat
South Africa|Pretoria
Kenya|Nairobi
Nigeria|Abuja
Turkey|Ankara
Greece|Athens
Italy|Rome
Spain|Madrid
Portugal|Lisbon
France|Paris
Germany|Berlin
Netherlands|Amsterdam
Belgium|Brussels
Switzerland|Bern
Austria|Vienna
Czech Republic|Prague
Poland|Warsaw
Norway|Oslo
Sweden|Stockholm
Finland|Helsinki
Denmark|Copenhagen
Ireland|Dublin
`);

  const landmarks = list(`
Eiffel Tower|France
Colosseum|Italy
Taj Mahal|India
Machu Picchu|Peru
Petra|Jordan
Angkor Wat|Cambodia
Pyramids of Giza|Egypt
Stonehenge|England
Christ the Redeemer|Brazil
Statue of Liberty|United States
Mount Rushmore|United States
Sagrada Familia|Spain
Acropolis|Greece
Great Wall|China
Burj Khalifa|United Arab Emirates
CN Tower|Canada
Table Mountain|South Africa
Neuschwanstein Castle|Germany
Brandenburg Gate|Germany
Louvre Museum|France
`);

  const rivers = list(`
London|Thames
Paris|Seine
Rome|Tiber
Cairo|Nile
Budapest|Danube
Vienna|Danube
Prague|Vltava
New York City|Hudson
Washington, D.C.|Potomac
Shanghai|Huangpu
Bangkok|Chao Phraya
Florence|Arno
Porto|Douro
Cologne|Rhine
New Orleans|Mississippi
`);

  const countries = list(`
Sahara Desert|Algeria
Atacama Desert|Chile
Gobi Desert|Mongolia
Amazon rainforest|Brazil
Galapagos Islands|Ecuador
Lake Baikal|Russia
Mount Fuji|Japan
Mount Kilimanjaro|Tanzania
Victoria Falls|Zimbabwe
Serengeti National Park|Tanzania
Yellowstone National Park|United States
Banff National Park|Canada
Santorini|Greece
Marrakech|Morocco
Dubrovnik|Croatia
Transylvania|Romania
Patagonia|Argentina
`);

  const currencies = list(`
Japan|yen
United Kingdom|pound sterling
United States|dollar
New Zealand|dollar
Canada|dollar
India|rupee
Indonesia|rupiah
Thailand|baht
China|yuan
South Korea|won
Mexico|peso
Brazil|real
South Africa|rand
Switzerland|franc
Sweden|krona
Norway|krone
Denmark|krone
Turkey|lira
Poland|zloty
`);

  const stateCapitals = list(`
Alabama|Montgomery
Alaska|Juneau
Arizona|Phoenix
Arkansas|Little Rock
California|Sacramento
Colorado|Denver
Connecticut|Hartford
Florida|Tallahassee
Georgia|Atlanta
Hawaii|Honolulu
Illinois|Springfield
Massachusetts|Boston
Michigan|Lansing
Minnesota|Saint Paul
Nevada|Carson City
New York|Albany
Ohio|Columbus
Oregon|Salem
Texas|Austin
Washington|Olympia
`);

  return [
    ...rowsFrom(capitals, ([country]) => `What is the capital of ${country}?`, ([, capital]) => capital, ([, capital]) => capital),
    ...rowsFrom(capitals, ([country]) => `Which city serves as the capital of ${country}?`, ([, capital]) => capital, ([, capital]) => capital),
    ...rowsFrom(capitals, ([country]) => `Name the capital city of ${country}.`, ([, capital]) => capital, ([, capital]) => capital),
    ...rowsFrom(capitals, ([country, capital]) => `${capital} is the capital of which country?`, ([country]) => country, ([country]) => country),
    ...rowsFrom(capitals, ([country, capital]) => `Which country has ${capital} as its capital?`, ([country]) => country, ([country]) => country),
    ...rowsFrom(landmarks, ([landmark]) => `Which country is home to ${landmark}?`, ([, country]) => country, ([, country]) => country),
    ...rowsFrom(landmarks, ([landmark]) => `${landmark} is found in which country?`, ([, country]) => country, ([, country]) => country),
    ...rowsFrom(landmarks, ([landmark, country]) => `Which landmark is in ${country}?`, ([landmark]) => landmark, ([landmark]) => landmark),
    ...rowsFrom(landmarks, ([landmark, country]) => `${country} is home to which landmark?`, ([landmark]) => landmark, ([landmark]) => landmark),
    ...rowsFrom(rivers, ([city]) => `Which river flows through ${city}?`, ([, river]) => river, ([, river]) => river),
    ...rowsFrom(rivers, ([city, river]) => `${river} flows through which city?`, ([city]) => city, ([city]) => city),
    ...rowsFrom(rivers, ([city]) => `Name the river most associated with ${city}.`, ([, river]) => river, ([, river]) => river),
    ...rowsFrom(countries, ([place]) => `Which country is associated with ${place}?`, ([, country]) => country, ([, country]) => country),
    ...rowsFrom(countries, ([place]) => `${place} is in, or strongly associated with, which country?`, ([, country]) => country, ([, country]) => country),
    ...rowsFrom(countries, ([place, country]) => `Which place is associated with ${country}?`, ([place]) => place, ([place]) => place),
    ...rowsFrom(currencies, ([country]) => `What currency is used in ${country}?`, ([, currency]) => currency, ([, currency]) => currency),
    ...rowsFrom(currencies, ([country]) => `Which currency would you use in ${country}?`, ([, currency]) => currency, ([, currency]) => currency),
    ...rowsFrom(currencies, ([country, currency]) => `The ${currency} is used in which country?`, ([country]) => country, ([country]) => country),
    ...rowsFrom(stateCapitals, ([state]) => `What is the capital of the U.S. state of ${state}?`, ([, capital]) => capital, ([, capital]) => capital)
  ];
}

function rowsFrom(facts, questionFn, answerFn, poolFn) {
  const pool = unique(facts.map(poolFn));
  return facts.map((fact, index) => {
    const answer = answerFn(fact);
    return [questionFn(fact), answer, pickDistractors(answer, pool, index)];
  });
}

function pickDistractors(answer, pool, index) {
  const choices = pool.filter((item) => item !== answer);
  if (choices.length < 3) {
    throw new Error(`Not enough distractors for ${answer}.`);
  }
  return [0, 1, 2].map((offset) => choices[(index + offset) % choices.length]);
}

function unique(values) {
  return [...new Set(values)];
}

function list(block) {
  return block
    .trim()
    .split("\n")
    .map((line) => line.trim().split("|"));
}

import { expandQuestionSets } from "./question-expansion.js";

const QUESTION_SETS = {
  sport: [
    ["Which venue traditionally hosts the Boxing Day Test in Australia?", "Melbourne Cricket Ground", ["Sydney Cricket Ground", "Adelaide Oval", "The Gabba"]],
    ["The Ashes is a cricket rivalry between Australia and which country?", "England", ["India", "New Zealand", "South Africa"]],
    ["What was Don Bradman's Test batting average?", "99.94", ["89.94", "100.00", "109.94"]],
    ["Which Australian athlete won the women's 400 metres at the Sydney 2000 Olympics?", "Cathy Freeman", ["Sally Pearson", "Jane Saville", "Nova Peris"]],
    ["Which sport is Ian Thorpe best known for?", "Swimming", ["Cycling", "Athletics", "Rowing"]],
    ["The Melbourne Cup is run over what distance?", "3200 metres", ["1600 metres", "2400 metres", "4000 metres"]],
    ["Which city hosts the Australian Open tennis tournament?", "Melbourne", ["Sydney", "Brisbane", "Perth"]],
    ["In Australian rules football, how many points is a goal worth?", "Six", ["One", "Three", "Four"]],
    ["In rugby league, how many points is a try worth?", "Four", ["Three", "Five", "Six"]],
    ["In rugby union, how many points is a try worth?", "Five", ["Two", "Four", "Seven"]],
    ["Which medal is awarded to the AFL's best and fairest player in the home-and-away season?", "Brownlow Medal", ["Norm Smith Medal", "Coleman Medal", "Jock McHale Medal"]],
    ["Which award recognises the NRL's player of the year?", "Dally M Medal", ["Clive Churchill Medal", "Wally Lewis Medal", "Ken Irvine Medal"]],
    ["Which team nickname belongs to Australia's men's national football team?", "Socceroos", ["Wallabies", "Kookaburras", "Boomers"]],
    ["Which team nickname belongs to Australia's women's national football team?", "Matildas", ["Diamonds", "Opals", "Jillaroos"]],
    ["Which team nickname belongs to Australia's men's rugby union team?", "Wallabies", ["Kangaroos", "Socceroos", "Boomers"]],
    ["Which team nickname belongs to Australia's national netball team?", "Diamonds", ["Opals", "Matildas", "Hockeyroos"]],
    ["Which national men's hockey team is known as the Kookaburras?", "Australia", ["New Zealand", "England", "South Africa"]],
    ["Which national women's hockey team is known as the Hockeyroos?", "Australia", ["Canada", "Ireland", "India"]],
    ["Which Australian cyclist won the Tour de France in 2011?", "Cadel Evans", ["Robbie McEwen", "Stuart O'Grady", "Simon Gerrans"]],
    ["Which Australian soccer player is famous for captaining the Matildas and starring as a striker?", "Sam Kerr", ["Ellyse Perry", "Alyssa Healy", "Stephanie Gilmore"]],
    ["Which Australian basketballer was a WNBA MVP and a Seattle Storm champion?", "Lauren Jackson", ["Liz Cambage", "Penny Taylor", "Michele Timms"]],
    ["What type of bowling was Shane Warne famous for?", "Leg spin", ["Fast bowling", "Off spin", "Left-arm seam"]],
    ["The Allan Border Medal is awarded in which sport?", "Cricket", ["Rugby league", "Australian rules football", "Tennis"]],
    ["AFLW is the women's competition for which sport?", "Australian rules football", ["Rugby union", "Basketball", "Football"]],
    ["The Stawell Gift is a famous race in which sport?", "Athletics", ["Cycling", "Horse racing", "Swimming"]],
    ["Sydney hosted the Summer Olympics in which year?", "2000", ["1988", "1996", "2004"]],
    ["Which motorsport race is held at Mount Panorama?", "Bathurst 1000", ["Australian Grand Prix", "Indy 500", "Le Mans 24 Hours"]],
    ["The Australian Formula 1 Grand Prix is held at which Melbourne parkland circuit?", "Albert Park", ["Calder Park", "Sandown", "Phillip Island"]],
    ["The Sydney to Hobart yacht race traditionally starts on which day?", "Boxing Day", ["New Year's Day", "Australia Day", "Anzac Day"]],
    ["Which yacht ended the New York Yacht Club's long America's Cup winning streak in 1983?", "Australia II", ["Wild Oats XI", "Kookaburra", "Black Jack"]],
    ["What is the national domestic first-class cricket competition in Australia called?", "Sheffield Shield", ["Big Bash League", "Marsh Cup", "Border-Gavaskar Trophy"]],
    ["What format is played in the Big Bash League?", "Twenty20 cricket", ["Test cricket", "One-day cricket", "Indoor cricket"]],
    ["The Bledisloe Cup is contested by Australia and which country?", "New Zealand", ["England", "France", "South Africa"]],
    ["Which AFL club is nicknamed the Magpies?", "Collingwood", ["Carlton", "Essendon", "Richmond"]],
    ["Which NRL club is based in Auckland?", "New Zealand Warriors", ["Canberra Raiders", "Melbourne Storm", "Gold Coast Titans"]],
    ["Which NRL team is nicknamed the Broncos?", "Brisbane", ["Parramatta", "Penrith", "Cronulla"]],
    ["Which Australian tennis player completed two calendar-year Grand Slams?", "Rod Laver", ["Pat Rafter", "Lleyton Hewitt", "John Newcombe"]],
    ["Which Australian tennis champion was born Evonne Goolagong?", "Evonne Goolagong Cawley", ["Margaret Court", "Ash Barty", "Sam Stosur"]],
    ["Which arena is the main stadium for the Australian Open?", "Rod Laver Arena", ["John Cain Arena", "Margaret Court Arena", "Ken Rosewall Arena"]],
    ["Which Australian won the 2022 Australian Open women's singles title?", "Ash Barty", ["Sam Stosur", "Ajla Tomljanovic", "Daria Saville"]],
    ["Which sport uses the term 'behind' for a one-point score?", "Australian rules football", ["Rugby league", "Cricket", "Netball"]],
    ["How many players are on the field for each AFL team during play?", "18", ["11", "13", "15"]],
    ["How many players are on the field for each rugby league team?", "13", ["11", "15", "18"]],
    ["How many players are on court for each netball team?", "7", ["5", "6", "9"]],
    ["The Clive Churchill Medal is awarded after which event?", "NRL Grand Final", ["AFL Grand Final", "Melbourne Cup", "Australian Open final"]],
    ["The Norm Smith Medal is awarded after which event?", "AFL Grand Final", ["NRL Grand Final", "State of Origin", "Bledisloe Cup"]],
    ["Which cricket trophy is contested in Test series between Australia and India?", "Border-Gavaskar Trophy", ["Frank Worrell Trophy", "Chappell-Hadlee Trophy", "Trans-Tasman Trophy"]],
    ["Which trophy is contested in one-day cricket between Australia and New Zealand?", "Chappell-Hadlee Trophy", ["Ashes urn", "Border-Gavaskar Trophy", "Sheffield Shield"]],
    ["Which national team is known as the Australian Boomers?", "Men's basketball", ["Men's hockey", "Women's netball", "Men's rugby league"]],
    ["Which national team is known as the Australian Opals?", "Women's basketball", ["Women's football", "Women's hockey", "Women's rugby union"]],
    ["Which football club went unbeaten in the 2003-04 English Premier League season?", "Arsenal", ["Chelsea", "Manchester United", "Liverpool"]],
    ["Which club plays its home football matches at Anfield?", "Liverpool", ["Everton", "Tottenham Hotspur", "Aston Villa"]],
    ["England defeated which country in the 1966 FIFA World Cup final?", "West Germany", ["Argentina", "Brazil", "Portugal"]],
    ["Who scored the famous 'Hand of God' goal at the 1986 FIFA World Cup?", "Diego Maradona", ["Pele", "Lionel Messi", "Zinedine Zidane"]],
    ["Which country won the men's Rugby World Cup in 2019?", "South Africa", ["England", "New Zealand", "Wales"]],
    ["The Ryder Cup is contested between Europe and which other team?", "United States", ["Australia", "Asia", "South Africa"]],
    ["Which golf major is played at Augusta National Golf Club?", "The Masters", ["U.S. Open", "The Open Championship", "PGA Championship"]],
    ["Which horse won the U.S. Triple Crown in 1973?", "Secretariat", ["Seattle Slew", "Affirmed", "American Pharoah"]],
    ["Which horse race is known as 'The Run for the Roses'?", "Kentucky Derby", ["Preakness Stakes", "Belmont Stakes", "Melbourne Cup"]],
    ["Which NBA team did Michael Jordan win six championships with?", "Chicago Bulls", ["Los Angeles Lakers", "Boston Celtics", "Detroit Pistons"]],
    ["Which NBA team drafted LeBron James in 2003?", "Cleveland Cavaliers", ["Miami Heat", "Los Angeles Lakers", "Chicago Bulls"]],
    ["Which NFL team did Tom Brady win his first six Super Bowls with?", "New England Patriots", ["Tampa Bay Buccaneers", "Dallas Cowboys", "Green Bay Packers"]],
    ["Which Major League Baseball team is nicknamed the Yankees?", "New York", ["Boston", "Chicago", "Los Angeles"]],
    ["Which baseball stadium is home to the Green Monster left-field wall?", "Fenway Park", ["Yankee Stadium", "Wrigley Field", "Dodger Stadium"]],
    ["The 'Miracle on Ice' happened at which Winter Olympics?", "Lake Placid 1980", ["Calgary 1988", "Nagano 1998", "Salt Lake City 2002"]],
    ["Which sprinter set the men's 100 metre world record of 9.58 seconds?", "Usain Bolt", ["Carl Lewis", "Yohan Blake", "Justin Gatlin"]],
    ["Which Formula 1 team did Ayrton Senna win his three world titles with?", "McLaren", ["Ferrari", "Williams", "Lotus"]],
    ["Which Formula 1 driver has seven world championships, level with Michael Schumacher?", "Lewis Hamilton", ["Sebastian Vettel", "Fernando Alonso", "Max Verstappen"]],
    ["Which tennis tournament is played at Roland-Garros?", "French Open", ["Wimbledon", "U.S. Open", "Australian Open"]],
    ["Roger Federer won his first Wimbledon singles title in which year?", "2003", ["1999", "2001", "2005"]],
    ["Which cricket bowler was the first to take 800 Test wickets?", "Muttiah Muralitharan", ["Shane Warne", "Anil Kumble", "Glenn McGrath"]],
    ["Which country won the first men's Cricket World Cup in 1975?", "West Indies", ["Australia", "England", "India"]],
    ["Which England fast bowler was central to the Bodyline series?", "Harold Larwood", ["Fred Trueman", "James Anderson", "Bob Willis"]],
    ["In darts, what is the highest score with a single dart?", "60", ["50", "100", "180"]],
    ["Which football club plays its home matches at Old Trafford?", "Manchester United", ["Manchester City", "Liverpool", "Arsenal"]]
  ],
  music: [
    ["Which Australian band released 'Highway to Hell'?", "AC/DC", ["INXS", "Cold Chisel", "Midnight Oil"]],
    ["Which AC/DC guitarist is known for wearing a school uniform on stage?", "Angus Young", ["Malcolm Young", "Bon Scott", "Phil Rudd"]],
    ["Who was the lead singer of INXS?", "Michael Hutchence", ["Jimmy Barnes", "Peter Garrett", "John Farnham"]],
    ["Which band had a global hit with 'Down Under'?", "Men at Work", ["Crowded House", "Australian Crawl", "Mental As Anything"]],
    ["Which Midnight Oil song includes the line 'How can we dance when our earth is turning'?", "Beds Are Burning", ["Blue Sky Mine", "Power and the Passion", "The Dead Heart"]],
    ["Which Midnight Oil frontman later became a federal politician?", "Peter Garrett", ["Rob Hirst", "Jim Moginie", "Martin Rotsey"]],
    ["Which singer had a major hit with 'You're the Voice'?", "John Farnham", ["Daryl Braithwaite", "Jimmy Barnes", "Russell Morris"]],
    ["Which country singer recorded 'A Pub With No Beer'?", "Slim Dusty", ["Troy Cassar-Daley", "Lee Kernaghan", "John Williamson"]],
    ["Which Paul Kelly song begins with a woman catching a bus from Adelaide?", "To Her Door", ["From Little Things Big Things Grow", "Dumb Things", "Before Too Long"]],
    ["Which Australian singer first became famous playing Charlene on 'Neighbours'?", "Kylie Minogue", ["Delta Goodrem", "Natalie Imbruglia", "Tina Arena"]],
    ["Which Kylie Minogue song opens with a famous 'la la la' hook?", "Can't Get You Out of My Head", ["Spinning Around", "The Loco-Motion", "Better the Devil You Know"]],
    ["Which artist released the song 'Chandelier'?", "Sia", ["Kimbra", "Tones and I", "Missy Higgins"]],
    ["Which Australian artist had a global hit with 'Somebody That I Used to Know'?", "Gotye", ["Vance Joy", "Flume", "Troye Sivan"]],
    ["Which New Zealand-born singer featured on Gotye's 'Somebody That I Used to Know'?", "Kimbra", ["Lorde", "Bic Runga", "Ladyhawke"]],
    ["Which project is led by Kevin Parker?", "Tame Impala", ["Empire of the Sun", "Peking Duk", "Rufus Du Sol"]],
    ["Which Australian producer won a Grammy for the album 'Skin'?", "Flume", ["Fisher", "Timmy Trumpet", "What So Not"]],
    ["Which Vance Joy song mentions a riptide?", "Riptide", ["Georgia", "Fire and the Flood", "Mess Is Mine"]],
    ["Which children's group originally included Anthony, Murray, Greg, and Jeff?", "The Wiggles", ["Hi-5", "The Hooley Dooleys", "The Fairies"]],
    ["Which original Wiggle wears blue?", "Anthony Field", ["Murray Cook", "Greg Page", "Jeff Fatt"]],
    ["Which Brisbane band released 'My Happiness'?", "Powderfinger", ["Silverchair", "Grinspoon", "The Living End"]],
    ["Which band from Newcastle released 'Tomorrow' while still teenagers?", "Silverchair", ["Powderfinger", "Jet", "Eskimo Joe"]],
    ["Which Australian band released 'Friday on My Mind'?", "The Easybeats", ["The Angels", "Daddy Cool", "Skyhooks"]],
    ["Which band released the Australian classic 'Eagle Rock'?", "Daddy Cool", ["Sherbet", "Cold Chisel", "Dragon"]],
    ["Which Cold Chisel song mentions Khe Sanh?", "Khe Sanh", ["Flame Trees", "Cheap Wine", "Bow River"]],
    ["Who was the lead singer of Cold Chisel?", "Jimmy Barnes", ["Ian Moss", "Don Walker", "Mossy Cade"]],
    ["Which Yothu Yindi song became an anthem for reconciliation?", "Treaty", ["Solid Rock", "My Island Home", "Blackfella/Whitefella"]],
    ["Which band recorded 'Solid Rock'?", "Goanna", ["Yothu Yindi", "Midnight Oil", "Hunters & Collectors"]],
    ["Which Australian Crawl song begins 'Meet me down by the jetty landing'?", "Reckless", ["The Boys Light Up", "Downhearted", "Errol"]],
    ["Which band recorded 'Throw Your Arms Around Me'?", "Hunters & Collectors", ["Mental As Anything", "The Church", "The Triffids"]],
    ["Which band released 'Sweet Disposition'?", "The Temper Trap", ["Empire of the Sun", "Pnau", "Cut Copy"]],
    ["Which duo released 'Walking on a Dream'?", "Empire of the Sun", ["Angus & Julia Stone", "Savage Garden", "Rufus Du Sol"]],
    ["Which sibling duo released 'Big Jet Plane'?", "Angus & Julia Stone", ["The Veronicas", "The Presets", "The Waifs"]],
    ["Which INXS song shares its title with a line meaning 'never separate us'?", "Never Tear Us Apart", ["Need You Tonight", "Original Sin", "Mystify"]],
    ["Which Icehouse song is an Australian anthem about the land?", "Great Southern Land", ["Electric Blue", "Crazy", "Hey Little Girl"]],
    ["Which Brisbane duo released 'Truly Madly Deeply'?", "Savage Garden", ["Air Supply", "Bachelor Girl", "Taxiride"]],
    ["Which Tina Arena song includes the chorus 'You're in chains'?", "Chains", ["Sorrento Moon", "Burn", "Heaven Help My Heart"]],
    ["Who won the first season of 'Australian Idol'?", "Guy Sebastian", ["Shannon Noll", "Anthony Callea", "Wes Carr"]],
    ["Which Divinyls song became an international hit in 1991?", "I Touch Myself", ["Boys in Town", "Pleasure and Pain", "Science Fiction"]],
    ["Which band recorded 'Am I Ever Gonna See Your Face Again'?", "The Angels", ["The Saints", "Radio Birdman", "Rose Tattoo"]],
    ["Which Christine Anu song is strongly associated with the Torres Strait Islands?", "My Island Home", ["Party", "Sunshine on a Rainy Day", "Come On"]],
    ["Which Archie Roach song tells the story of the Stolen Generations?", "Took the Children Away", ["Charcoal Lane", "From Little Things Big Things Grow", "Black Smoke"]],
    ["Which Kate Miller-Heidke song represented Australia at Eurovision 2019?", "Zero Gravity", ["The Last Day on Earth", "Caught in the Crowd", "Words"]],
    ["The ARIA Awards recognise achievement in which field?", "Australian music", ["Australian film", "Australian television", "Australian sport"]],
    ["Triple J's Hottest 100 is usually a countdown of what?", "Songs voted by listeners", ["Albums chosen by critics", "Concert venues", "Music videos"]],
    ["Which band released 'Under the Milky Way'?", "The Church", ["The Triffids", "The Go-Betweens", "The Saints"]],
    ["Which band released 'Wide Open Road'?", "The Triffids", ["The Church", "The Go-Betweens", "Midnight Oil"]],
    ["Which band released 'Cattle and Cane'?", "The Go-Betweens", ["The Saints", "The Models", "The Reels"]],
    ["Which Australian punk band released '(I'm) Stranded'?", "The Saints", ["Radio Birdman", "The Angels", "The Birthday Party"]],
    ["Which Nick Cave band includes the words 'Bad Seeds' in its name?", "Nick Cave and the Bad Seeds", ["The Birthday Party", "Grinderman", "The Boys Next Door"]],
    ["Which singer released the viral hit 'Dance Monkey'?", "Tones and I", ["Amy Shark", "Montaigne", "G Flip"]],
    ["Which band released the album 'Abbey Road'?", "The Beatles", ["The Rolling Stones", "The Who", "Pink Floyd"]],
    ["Which Queen song begins with the line 'Is this the real life?'", "Bohemian Rhapsody", ["Don't Stop Me Now", "We Will Rock You", "Somebody to Love"]],
    ["Which Michael Jackson album includes 'Beat It' and 'Billie Jean'?", "Thriller", ["Bad", "Off the Wall", "Dangerous"]],
    ["Which Madonna album shares its name with one of her 1984 singles about marriage?", "Like a Virgin", ["True Blue", "Ray of Light", "Music"]],
    ["Which Nirvana album features the song 'Smells Like Teen Spirit'?", "Nevermind", ["In Utero", "Bleach", "MTV Unplugged in New York"]],
    ["Which Oasis song opens with 'Today is gonna be the day'?", "Wonderwall", ["Champagne Supernova", "Don't Look Back in Anger", "Live Forever"]],
    ["Which Amy Winehouse album includes 'Rehab'?", "Back to Black", ["Frank", "Lioness", "19"]],
    ["Adele's album named after her age at release includes 'Rolling in the Deep'. What is it called?", "21", ["19", "25", "30"]],
    ["Which Elton John song is subtitled 'I Think It's Going to Be a Long, Long Time'?", "Rocket Man", ["Tiny Dancer", "Your Song", "Candle in the Wind"]],
    ["Which David Bowie alter ego was backed by the Spiders from Mars?", "Ziggy Stardust", ["Aladdin Sane", "Thin White Duke", "Major Tom"]],
    ["Which Fleetwood Mac album includes 'Go Your Own Way'?", "Rumours", ["Tusk", "Mirage", "Tango in the Night"]],
    ["Which Prince album and film share the title 'Purple Rain'?", "Purple Rain", ["1999", "Sign o' the Times", "Parade"]],
    ["Which Bruce Springsteen album features the title track 'Born in the U.S.A.'?", "Born in the U.S.A.", ["Born to Run", "Nebraska", "The River"]],
    ["Which Taylor Swift album includes 'Blank Space' and 'Shake It Off'?", "1989", ["Red", "Fearless", "Lover"]],
    ["Which Spice Girls single begins with 'Yo, I'll tell you what I want'?", "Wannabe", ["Spice Up Your Life", "Say You'll Be There", "2 Become 1"]],
    ["Which Beyonce solo single features Jay-Z and opens with a horn riff?", "Crazy in Love", ["Single Ladies", "Halo", "Irreplaceable"]],
    ["Eminem's 'Lose Yourself' was written for which film?", "8 Mile", ["Get Rich or Die Tryin'", "Notorious", "Straight Outta Compton"]],
    ["Which singer-songwriter won the 2016 Nobel Prize in Literature?", "Bob Dylan", ["Paul Simon", "Leonard Cohen", "Bruce Springsteen"]],
    ["Which Radiohead album includes 'Paranoid Android'?", "OK Computer", ["Kid A", "The Bends", "In Rainbows"]],
    ["Which Rolling Stones song has the refrain 'I can't get no'?", "(I Can't Get No) Satisfaction", ["Paint It Black", "Gimme Shelter", "Start Me Up"]],
    ["Which U2 album includes 'With or Without You'?", "The Joshua Tree", ["Achtung Baby", "War", "All That You Can't Leave Behind"]],
    ["Who wrote and first recorded 'I Will Always Love You'?", "Dolly Parton", ["Whitney Houston", "Diana Ross", "Aretha Franklin"]],
    ["Which band released the album 'Dark Side of the Moon'?", "Pink Floyd", ["Led Zeppelin", "The Doors", "Genesis"]],
    ["Which rapper released the album 'The College Dropout'?", "Kanye West", ["Jay-Z", "Drake", "Kendrick Lamar"]],
    ["Which American singer released '...Baby One More Time'?", "Britney Spears", ["Christina Aguilera", "Jessica Simpson", "Mandy Moore"]]
  ],
  culture: [
    ["Which Danish architect designed the Sydney Opera House?", "Jorn Utzon", ["Harry Seidler", "Walter Burley Griffin", "Glenn Murcutt"]],
    ["What is the nickname of the Sydney Harbour Bridge?", "The Coathanger", ["The Big Arch", "The Iron Rainbow", "The Harbour Ladder"]],
    ["Which fictional street is central to 'Neighbours'?", "Ramsay Street", ["Summer Bay Road", "Fountain Lakes Drive", "Wandin Valley Way"]],
    ["Which fictional coastal town is the setting for 'Home and Away'?", "Summer Bay", ["Ramsay Bay", "Pearl Bay", "Port Niranda"]],
    ["Which Australian city is strongly associated with the children's show 'Bluey'?", "Brisbane", ["Melbourne", "Adelaide", "Hobart"]],
    ["In 'Kath & Kim', what is the family's fictional suburb?", "Fountain Lakes", ["Summer Bay", "Pearl Bay", "Erinsborough"]],
    ["Which actor played Mick Dundee in 'Crocodile Dundee'?", "Paul Hogan", ["Bryan Brown", "Mel Gibson", "Sam Neill"]],
    ["Who directed the original 'Mad Max' film?", "George Miller", ["Peter Weir", "Baz Luhrmann", "Phillip Noyce"]],
    ["Which Australian film features the line 'Tell him he's dreaming'?", "The Castle", ["Muriel's Wedding", "Strictly Ballroom", "Red Dog"]],
    ["Which Australian film stars Toni Collette as a woman from Porpoise Spit?", "Muriel's Wedding", ["The Dressmaker", "Japanese Story", "Looking for Alibrandi"]],
    ["Which Australian film follows drag performers travelling to Alice Springs?", "The Adventures of Priscilla, Queen of the Desert", ["Strictly Ballroom", "The Sapphires", "Bran Nue Dae"]],
    ["Which author wrote 'Cloudstreet'?", "Tim Winton", ["Peter Carey", "Richard Flanagan", "Thomas Keneally"]],
    ["Which Australian writer won the Nobel Prize in Literature in 1973?", "Patrick White", ["David Malouf", "Christina Stead", "Geraldine Brooks"]],
    ["Which major Australian literary prize is named after an author of 'My Brilliant Career'?", "Miles Franklin Award", ["Stella Prize", "Booker Prize", "Prime Minister's Literary Award"]],
    ["'Picnic at Hanging Rock' is set in which Australian state?", "Victoria", ["Tasmania", "Queensland", "Western Australia"]],
    ["Which comedian created Dame Edna Everage?", "Barry Humphries", ["Graham Kennedy", "Paul Hogan", "Shaun Micallef"]],
    ["Who wrote the words to 'Waltzing Matilda'?", "Banjo Paterson", ["Henry Lawson", "Dorothea Mackellar", "C. J. Dennis"]],
    ["Which Australian poet wrote 'The Drover's Wife'?", "Henry Lawson", ["Banjo Paterson", "Judith Wright", "Les Murray"]],
    ["Which bushranger is associated with a homemade suit of armour?", "Ned Kelly", ["Ben Hall", "Captain Thunderbolt", "Moondyne Joe"]],
    ["Which airline is nicknamed 'The Flying Kangaroo'?", "Qantas", ["Virgin Australia", "Jetstar", "Rex"]],
    ["Which museum is known by the acronym MONA?", "Museum of Old and New Art", ["Museum of National Australia", "Melbourne Open National Art", "Modern Oceanic Northern Archive"]],
    ["MONA is located near which Australian city?", "Hobart", ["Darwin", "Canberra", "Perth"]],
    ["The National Gallery of Victoria is in which city?", "Melbourne", ["Sydney", "Adelaide", "Brisbane"]],
    ["Which city hosts the Adelaide Fringe?", "Adelaide", ["Perth", "Canberra", "Darwin"]],
    ["Which film centres on the Parkes radio telescope during the Apollo 11 mission?", "The Dish", ["The Castle", "Crackerjack", "Malcolm"]],
    ["In Australian slang, what does 'arvo' mean?", "Afternoon", ["Breakfast", "Holiday", "Argument"]],
    ["In Australian slang, what is a 'servo'?", "Service station", ["School", "Suburb", "Surfboard"]],
    ["In Australian slang, what is a 'bottle-o'?", "Liquor shop", ["Bakery", "Bottle museum", "Beach kiosk"]],
    ["In Australia, what are 'thongs' usually worn on?", "Feet", ["Hands", "Head", "Wrists"]],
    ["What type of item is an Akubra?", "Hat", ["Boot", "Coat", "Knife"]],
    ["What type of item is a Driza-Bone?", "Coat", ["Hat", "Tent", "Belt"]],
    ["R. M. Williams is especially known for making what?", "Boots", ["Surfboards", "Cricket bats", "Sunglasses"]],
    ["NAIDOC Week celebrates the history and culture of which peoples?", "Aboriginal and Torres Strait Islander peoples", ["Irish Australians", "Greek Australians", "Pacific athletes"]],
    ["Which returning throwing tool is commonly associated with Aboriginal Australian culture?", "Boomerang", ["Woomera", "Didgeridoo", "Nulla nulla"]],
    ["The traditional owners of Uluru are known collectively as what?", "Anangu", ["Noongar", "Kulin", "Palawa"]],
    ["Which constellation appears on the Australian flag?", "Southern Cross", ["Orion", "Scorpius", "Pleiades"]],
    ["In 'Waltzing Matilda', what animal does the swagman steal?", "Jumbuck", ["Kangaroo", "Emu", "Goanna"]],
    ["What is Australia's national anthem?", "Advance Australia Fair", ["Waltzing Matilda", "I Still Call Australia Home", "True Blue"]],
    ["What kind of household item is a Hills Hoist?", "Rotary clothesline", ["Kitchen mixer", "Garden hose", "Mailbox"]],
    ["A Bunnings sausage sizzle is usually sold outside what type of store?", "Hardware store", ["Bookshop", "Cinema", "Pharmacy"]],
    ["What is 'Schoolies' in Australian culture?", "End-of-school celebrations", ["A school uniform brand", "A children's cereal", "A TV quiz show"]],
    ["Which long-running TV drama was set around Wandin Valley?", "A Country Practice", ["Blue Heelers", "All Saints", "Packed to the Rafters"]],
    ["Which children's TV series features a family living in a lighthouse?", "Round the Twist", ["Play School", "Ship to Shore", "The Ferals"]],
    ["Which kangaroo starred in a classic Australian TV series?", "Skippy", ["Blinky Bill", "Bunyip Bluegum", "Fatso"]],
    ["Which beach is central to the TV series 'Bondi Rescue'?", "Bondi Beach", ["Manly Beach", "St Kilda Beach", "Cottesloe Beach"]],
    ["Which Australian cooking show features mystery boxes and pressure tests?", "MasterChef Australia", ["My Kitchen Rules", "Ready Steady Cook", "The Cook Up"]],
    ["Which novel by Melina Marchetta follows Josie Alibrandi?", "Looking for Alibrandi", ["Tomorrow, When the War Began", "Puberty Blues", "Playing Beatie Bow"]],
    ["Which John Marsden novel begins a series about teenagers after an invasion?", "Tomorrow, When the War Began", ["So Much to Tell You", "Blueback", "Lockie Leonard"]],
    ["Which Australian animated koala was created by Dorothy Wall?", "Blinky Bill", ["Snugglepot", "Skippy", "Bunyip Bluegum"]],
    ["Which gumnut babies were created by May Gibbs?", "Snugglepot and Cuddlepie", ["Blinky and Nutsy", "Dot and Dash", "Mim and Pip"]],
    ["In 'The Simpsons', what is the name of the family's hometown?", "Springfield", ["Shelbyville", "Ogdenville", "North Haverbrook"]],
    ["In 'Friends', what is the name of the coffee shop?", "Central Perk", ["Monk's Cafe", "Luke's Diner", "The Peach Pit"]],
    ["Which school does Harry Potter attend?", "Hogwarts", ["Durmstrang", "Beauxbatons", "Ilvermorny"]],
    ["Sherlock Holmes lives at which London address?", "221B Baker Street", ["10 Downing Street", "12 Grimmauld Place", "742 Evergreen Terrace"]],
    ["Who created the original 'Star Wars' film series?", "George Lucas", ["Steven Spielberg", "James Cameron", "Ridley Scott"]],
    ["Most of 'Game of Thrones' takes place on which fictional continent?", "Westeros", ["Narnia", "Middle-earth", "Panem"]],
    ["Which actor played David Brent in the original UK version of 'The Office'?", "Ricky Gervais", ["Steve Carell", "Martin Freeman", "Stephen Merchant"]],
    ["In 'Seinfeld', what is Kramer's first name?", "Cosmo", ["Newman", "George", "Morty"]],
    ["In 'Citizen Kane', what is 'Rosebud'?", "A sled", ["A newspaper", "A mansion", "A horse"]],
    ["Which family is central to 'The Godfather'?", "Corleone", ["Soprano", "Tattaglia", "Barzini"]],
    ["Who wrote 'The Lord of the Rings'?", "J. R. R. Tolkien", ["C. S. Lewis", "George R. R. Martin", "Terry Pratchett"]],
    ["Who wrote 'Pride and Prejudice'?", "Jane Austen", ["Charlotte Bronte", "Emily Bronte", "Mary Shelley"]],
    ["Which Shakespeare play features the witches saying 'Double, double toil and trouble'?", "Macbeth", ["Hamlet", "King Lear", "Othello"]],
    ["In 'Doctor Who', what does the Doctor travel in?", "TARDIS", ["Millennium Falcon", "Enterprise", "DeLorean"]],
    ["What is James Bond's agent number?", "007", ["006", "008", "009"]],
    ["Which English city is central to 'Peaky Blinders'?", "Birmingham", ["Manchester", "Liverpool", "Leeds"]],
    ["In 'Ted Lasso', what sport does Ted coach in England?", "Football", ["Rugby", "Cricket", "Basketball"]],
    ["Which family owns Downton Abbey in the TV series?", "Crawley", ["Grantham", "Windsor", "Bridgerton"]],
    ["Which monarch is the central figure of the early seasons of 'The Crown'?", "Queen Elizabeth II", ["Queen Victoria", "Queen Elizabeth I", "Queen Mary"]],
    ["What is Walter White's chemistry-inspired alias in 'Breaking Bad'?", "Heisenberg", ["Gus", "Saul", "Hank"]],
    ["'The Wire' is primarily set in which U.S. city?", "Baltimore", ["Chicago", "Detroit", "Philadelphia"]],
    ["'Saturday Night Live' is filmed in which U.S. city?", "New York City", ["Los Angeles", "Chicago", "Boston"]],
    ["Who narrates 'The Great Gatsby'?", "Nick Carraway", ["Jay Gatsby", "Daisy Buchanan", "Tom Buchanan"]],
    ["What fictional African nation is home to Black Panther?", "Wakanda", ["Genovia", "Zamunda", "Latveria"]],
    ["Who directed the 2023 film 'Barbie'?", "Greta Gerwig", ["Sofia Coppola", "Patty Jenkins", "Chloe Zhao"]]
  ],
  general: [
    ["How many states does Australia have?", "Six", ["Five", "Seven", "Eight"]],
    ["What is the capital city of Australia?", "Canberra", ["Sydney", "Melbourne", "Brisbane"]],
    ["Which is Australia's largest state by area?", "Western Australia", ["Queensland", "South Australia", "New South Wales"]],
    ["Which Australian state is an island?", "Tasmania", ["Victoria", "Queensland", "South Australia"]],
    ["What is Australia's longest river?", "Murray River", ["Darling River", "Murrumbidgee River", "Lachlan River"]],
    ["What is Australia's highest mountain?", "Mount Kosciuszko", ["Mount Bogong", "Mount Ossa", "Cradle Mountain"]],
    ["The Great Barrier Reef lies off the coast of which state?", "Queensland", ["Western Australia", "Victoria", "Tasmania"]],
    ["Kakadu National Park is in which territory?", "Northern Territory", ["Australian Capital Territory", "Jervis Bay Territory", "Norfolk Island"]],
    ["What type of animal is a dingo?", "Wild dog", ["Wild cat", "Small kangaroo", "Large lizard"]],
    ["Which Australian animal is a monotreme?", "Platypus", ["Koala", "Wombat", "Possum"]],
    ["Which spiny Australian animal is also a monotreme?", "Echidna", ["Bilby", "Quokka", "Bandicoot"]],
    ["Which two animals appear on the Australian coat of arms?", "Kangaroo and emu", ["Koala and wombat", "Dingo and platypus", "Crocodile and cassowary"]],
    ["What do koalas mainly eat?", "Eucalyptus leaves", ["Wattle seeds", "Spinifex grass", "Banksia flowers"]],
    ["Which island near Perth is famous for quokkas?", "Rottnest Island", ["Kangaroo Island", "Phillip Island", "Bruny Island"]],
    ["What does the name 'Nullarbor' refer to?", "No trees", ["Red desert", "Long road", "Salt lake"]],
    ["Australia changed to decimal currency in which year?", "1966", ["1956", "1976", "1986"]],
    ["What is Australia's currency?", "Australian dollar", ["Australian pound", "Australian euro", "Australian crown"]],
    ["Where is Parliament House located?", "Canberra", ["Sydney", "Melbourne", "Adelaide"]],
    ["What is the official Canberra residence of the Prime Minister called?", "The Lodge", ["Yarralumla House", "Kirribilli House", "Government Cottage"]],
    ["Which court is the highest court in Australia's judicial system?", "High Court of Australia", ["Federal Court", "Supreme Court of NSW", "Family Court"]],
    ["The Governor-General represents whom in Australia?", "The monarch", ["The Prime Minister", "The Chief Justice", "The Senate"]],
    ["The First Fleet arrived in 1788 at which harbour?", "Sydney Harbour", ["Port Phillip Bay", "Moreton Bay", "Botany Bay only"]],
    ["In which year did Australia federate?", "1901", ["1788", "1851", "1914"]],
    ["On what date is Anzac Day observed?", "25 April", ["1 January", "26 January", "11 November"]],
    ["On what date is Australia Day marked nationally?", "26 January", ["25 April", "1 May", "3 September"]],
    ["The Eureka Stockade took place near which Victorian city?", "Ballarat", ["Bendigo", "Geelong", "Shepparton"]],
    ["Which service provides medical care to remote parts of Australia by air?", "Royal Flying Doctor Service", ["St John Air", "Outback Rescue Corps", "Australian Air Ambulance League"]],
    ["Where is the Royal Australian Mint located?", "Canberra", ["Perth", "Melbourne", "Sydney"]],
    ["Which Australian invented the flight data recorder known as the black box?", "David Warren", ["Howard Florey", "Graeme Clark", "John Monash"]],
    ["Which Australian scientist is strongly associated with the multi-channel cochlear implant?", "Graeme Clark", ["David Warren", "Howard Florey", "Elizabeth Blackburn"]],
    ["Which Australian scientist shared a Nobel Prize for work on penicillin?", "Howard Florey", ["Mark Oliphant", "Macfarlane Burnet", "Frank Fenner"]],
    ["Which chocolate biscuit is often used in a 'slam' with a hot drink?", "Tim Tam", ["Mint Slice", "Monte Carlo", "Iced VoVo"]],
    ["Which malted drink powder was developed in Australia in the 1930s?", "Milo", ["Ovaltine", "Nesquik", "Horlicks"]],
    ["Which city is the capital of Queensland?", "Brisbane", ["Cairns", "Townsville", "Gold Coast"]],
    ["Which city is the capital of South Australia?", "Adelaide", ["Whyalla", "Mount Gambier", "Port Augusta"]],
    ["Which city is the capital of Western Australia?", "Perth", ["Fremantle", "Bunbury", "Albany"]],
    ["Which city is the capital of Tasmania?", "Hobart", ["Launceston", "Devonport", "Burnie"]],
    ["Which city is the capital of the Northern Territory?", "Darwin", ["Alice Springs", "Katherine", "Tennant Creek"]],
    ["Which city is the capital of Victoria?", "Melbourne", ["Geelong", "Ballarat", "Bendigo"]],
    ["Which city is the capital of New South Wales?", "Sydney", ["Newcastle", "Wollongong", "Parramatta"]],
    ["The Ghan rail journey runs between Adelaide and which northern city?", "Darwin", ["Cairns", "Broome", "Townsville"]],
    ["The Indian Pacific rail journey runs between Sydney and which western city?", "Perth", ["Adelaide", "Darwin", "Hobart"]],
    ["The Great Ocean Road is in which state?", "Victoria", ["Queensland", "Western Australia", "Tasmania"]],
    ["The Twelve Apostles are primarily what kind of natural feature?", "Limestone stacks", ["Granite peaks", "Coral reefs", "Sand dunes"]],
    ["Which South Australian town is famous for underground homes and opal mining?", "Coober Pedy", ["Roxby Downs", "Port Pirie", "Renmark"]],
    ["Australia lies mainly in which hemisphere?", "Southern Hemisphere", ["Northern Hemisphere", "Eastern polar region", "Western polar region"]],
    ["Which line of latitude crosses Australia?", "Tropic of Capricorn", ["Equator", "Tropic of Cancer", "Arctic Circle"]],
    ["What is Australia's emergency phone number?", "000", ["111", "911", "999"]],
    ["What is Australia's international telephone country code?", "+61", ["+64", "+44", "+1"]],
    ["What is Australia's internet country-code domain?", ".au", [".oz", ".aus", ".aust"]],
    ["What is the capital of Canada?", "Ottawa", ["Toronto", "Vancouver", "Montreal"]],
    ["What is the capital of New Zealand?", "Wellington", ["Auckland", "Christchurch", "Dunedin"]],
    ["What is the capital of Brazil?", "Brasilia", ["Rio de Janeiro", "Sao Paulo", "Salvador"]],
    ["Which river flows through Paris?", "Seine", ["Thames", "Danube", "Rhine"]],
    ["Which river flows through London?", "Thames", ["Seine", "Mersey", "Clyde"]],
    ["Which river flows through Rome?", "Tiber", ["Po", "Arno", "Danube"]],
    ["The Suez Canal links the Mediterranean Sea with which sea?", "Red Sea", ["Black Sea", "Caspian Sea", "Arabian Sea"]],
    ["Mount Everest lies on the border of Nepal and which country?", "China", ["India", "Bhutan", "Pakistan"]],
    ["What is the largest hot desert in the world?", "Sahara", ["Gobi", "Kalahari", "Atacama"]],
    ["What is the capital of Iceland?", "Reykjavik", ["Oslo", "Helsinki", "Copenhagen"]],
    ["Which is the largest island of Japan?", "Honshu", ["Hokkaido", "Kyushu", "Shikoku"]],
    ["Machu Picchu is in which country?", "Peru", ["Chile", "Bolivia", "Ecuador"]],
    ["Petra is an ancient city in which modern country?", "Jordan", ["Egypt", "Turkey", "Lebanon"]],
    ["Angkor Wat is in which country?", "Cambodia", ["Thailand", "Vietnam", "Laos"]],
    ["The Galapagos Islands belong to which country?", "Ecuador", ["Peru", "Colombia", "Chile"]],
    ["Victoria Falls sits on the border of Zambia and which country?", "Zimbabwe", ["Botswana", "Namibia", "Mozambique"]],
    ["Lake Baikal is in which country?", "Russia", ["Mongolia", "Kazakhstan", "China"]],
    ["The Grand Canyon is in which U.S. state?", "Arizona", ["Nevada", "Utah", "Colorado"]],
    ["Mount Fuji is in which country?", "Japan", ["China", "South Korea", "Taiwan"]],
    ["Istanbul sits on which strait?", "Bosphorus", ["Dardanelles", "Gibraltar", "Hormuz"]],
    ["Prague is the capital of which country?", "Czech Republic", ["Austria", "Hungary", "Slovakia"]],
    ["What is the longest river in Europe?", "Volga", ["Danube", "Rhine", "Seine"]],
    ["The Pyramids of Giza are in which country?", "Egypt", ["Morocco", "Jordan", "Sudan"]],
    ["Mount Rushmore is in which U.S. state?", "South Dakota", ["North Dakota", "Wyoming", "Montana"]],
    ["Which country is home to the city of Marrakech?", "Morocco", ["Tunisia", "Algeria", "Egypt"]]
  ]
};

const EXPANDED_QUESTION_SETS = expandQuestionSets(QUESTION_SETS);

const EASY_QUESTIONS_PER_CATEGORY = 500;
const HARD_QUESTIONS_PER_CATEGORY = 2250;

export const QUESTION_BANK = Object.entries(EXPANDED_QUESTION_SETS).flatMap(([category, rows]) => {
  const questions = rows.map(([question, answer, distractors, meta = {}], index) => {
    const id = `${category}-${String(index + 1).padStart(3, "0")}`;
    return {
      id,
      category,
      question,
      options: rotateOptions([answer, ...distractors], index),
      answer,
      difficulty: "normal",
      hardnessScore: getQuestionHardnessScore(category, question, answer, meta),
      semanticKey: getSemanticKey(question, answer, meta),
      ...meta
    };
  });

  return assignDifficulties(questions, category).map(({ hardnessScore, ...question }) => question);
});

function rotateOptions(options, index) {
  const offset = index % options.length;
  return [...options.slice(offset), ...options.slice(0, offset)];
}

function assignDifficulties(questions, category) {
  const ranked = [...questions].sort((a, b) => {
    if (a.hardnessScore !== b.hardnessScore) return a.hardnessScore - b.hardnessScore;
    return a.id.localeCompare(b.id);
  });

  const easyPool = category === "sport" ? ranked.filter((question) => question.sportScopedOptions !== true) : ranked;
  const hardPool = category === "sport" ? ranked.filter((question) => question.sportScopedOptions === true) : ranked;
  const easyIds = new Set(easyPool.slice(0, EASY_QUESTIONS_PER_CATEGORY).map((question) => question.id));
  const hardIds = new Set(hardPool.slice(-HARD_QUESTIONS_PER_CATEGORY).map((question) => question.id));

  return questions.map((question) => ({
    ...question,
    difficulty: hardIds.has(question.id) ? "hard" : easyIds.has(question.id) ? "easy" : "normal"
  }));
}

function getQuestionHardnessScore(category, question, answer, meta) {
  const text = `${question} ${answer}`.toLowerCase();
  let score = 0;

  if (category === "sport") {
    score += scoreSportQuestion(text);
    score += meta.sportScopedOptions === true ? 20 : -20;
  }
  if (category === "music") score += scoreMusicQuestion(text);
  if (category === "culture") score += scoreCultureQuestion(text);
  if (category === "general") score += scoreGeneralQuestion(text);

  if (category !== "general" && /\b(19|20)\d{2}\b/.test(text)) score += 2;
  if (category !== "general" && /\b\d{2,3}(,\d{3})?\b/.test(text)) score += 2;
  if (/record|all-time|milestone|first|most|career|world championship|world record|olympic record/.test(text)) score += 3;
  if (/which answer fits|what matches this clue|what completes this/.test(text)) score += 1;

  return score;
}

function scoreSportQuestion(text) {
  let score = 0;
  if (/which athlete|which milestone belongs|associated with which achievement|in .+, who|milestone|achievement|record or feat|trivia clue|notable/.test(text)) score += 8;
  if (/scored|won|became|played|set|finished|kicked|took|captained|rings|titles|medals|centuries|wickets|home runs|super bowl mvp/.test(text)) score += 5;
  if (/muttiah|larwood|bodyline|borg-warner|heisman|calcutta|dally m|brownlow|lance franklin|johnathan thurston|richie mccaw|jonah lomu|valentino rossi/.test(text)) score += 3;
  if (/how many points|how many players|which sport is .* best known|nickname belongs|what type of bowling/.test(text)) score -= 5;
  if (/michael jordan|serena williams|usain bolt|tom brady|lebron james|tiger woods|lionel messi|cristiano ronaldo/.test(text)) score -= 1;
  return score;
}

function scoreMusicQuestion(text) {
  let score = 0;
  if (/composer|nobel prize|pulitzer|motown|woodstock|bond theme|eurovision|grammy|aria awards/.test(text)) score += 6;
  if (/frontperson|fronted/.test(text)) score += 3;
  if (/lead singer/.test(text)) score += 1;
  if (/album|released which album|associated with which album/.test(text)) score += 1;
  if (/the beatles|queen|michael jackson|madonna|taylor swift|beyonce|abba|kylie minogue|ac\/dc/.test(text)) score -= 2;
  if (/adele|21|1989|thriller|nevermind|purple rain|rehab|rolling in the deep|like a virgin|smells like teen spirit|blank space|shake it off/.test(text)) score -= 4;
  if (/triple j|aria awards|australian music|australian idol|pub with no beer|inxs|cold chisel|solid rock|throw your arms|dance monkey/.test(text)) score -= 4;
  if (/which artist released|who had a hit with/.test(text)) score -= 1;
  return score;
}

function scoreCultureQuestion(text) {
  let score = 0;
  if (/director|filmmaker|author|wrote|narrator|official award name|original wording|address/.test(text)) score += 4;
  if (/which film is associated|which book is by|played which character|performer behind/.test(text)) score += 2;
  if (/steven spielberg|james cameron|quentin tarantino|christopher nolan|francis ford coppola|martin scorsese|ridley scott|jaws|titanic|pulp fiction|inception|the godfather|goodfellas|alien/.test(text)) score -= 4;
  if (/friends|the simpsons|harry potter|star wars|james bond|breaking bad|the office|bluey/.test(text)) score -= 2;
  if (/coffee shop|hometown|agent number|time machine/.test(text)) score -= 2;
  return score;
}

function scoreGeneralQuestion(text) {
  let score = 0;
  if (/u\.s\. state|capital of the u\.s\. state|strait|longest river in europe|lake baikal|marrakech|petra|angkor wat|galapagos|victoria falls|tropic|vltava|chao phraya|huangpu|douro|potomac/.test(text)) score += 5;
  if (/currency|which currency|is used in which country/.test(text)) score += 1;
  if (/capital of canada|capital of new zealand|capital of australia|capital of japan|capital of france|capital of germany|eiffel tower|statue of liberty|grand canyon|mount fuji|which river flows through london|which river flows through paris|which river flows through rome/.test(text)) score -= 4;
  if (/australia's longest river|australia's currency|decimal currency|first fleet|federate|anzac day|australia day|how many states|capital city of australia/.test(text)) score -= 5;
  if (/emergency phone number|internet country-code|international telephone|how many states/.test(text)) score -= 4;
  if (/which country has|serves as the capital|name the capital/.test(text)) score += 1;
  if (/david warren|graeme clark|howard florey|royal flying doctor|tropic of capricorn/.test(text)) score += 3;
  return score;
}

function getSemanticKey(question, answer, meta) {
  if (meta.factKey) return meta.factKey;
  return `${normalizeSemanticText(stripQuestionWrapper(question))}|${normalizeSemanticText(answer)}`;
}

function stripQuestionWrapper(question) {
  return String(question)
    .replace(/^which answer best fits this clue:\s*/i, "")
    .replace(/^choose the correct answer:\s*/i, "")
    .replace(/^what would you lock in for this one:\s*/i, "")
    .replace(/^which option solves this question:\s*/i, "")
    .replace(/^what is the correct response:\s*/i, "")
    .replace(/^which option would you choose:\s*/i, "")
    .replace(/^what answer completes this:\s*/i, "")
    .replace(/^which choice is right:\s*/i, "")
    .replace(/^what is the best answer:\s*/i, "")
    .replace(/^which response is correct:\s*/i, "")
    .replace(/^how would you answer this:\s*/i, "")
    .replace(/^what should the answer be:\s*/i, "")
    .replace(/^which option matches:\s*/i, "")
    .replace(/^what is the right call:\s*/i, "")
    .replace(/^which answer is the fit:\s*/i, "");
}

function normalizeSemanticText(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

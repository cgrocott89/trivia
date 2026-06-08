export const TARGET_QUESTIONS_PER_CATEGORY = 5000;

export function expandQuestionSets(baseSets) {
  const supplements = {
    sport: buildSportRows(),
    music: buildMusicRows(),
    culture: buildCultureRows(),
    general: buildGeneralRows()
  };

  return Object.fromEntries(
    Object.entries(baseSets).map(([category, rows]) => {
      const baseRows = rows.filter(isSafeQuestionRow);
      const needed = TARGET_QUESTIONS_PER_CATEGORY - baseRows.length;
      if (needed < 0) {
        throw new Error(`${category} already has more than ${TARGET_QUESTIONS_PER_CATEGORY} questions.`);
      }
      const expanded = [...baseRows, ...fillSupplementRows(baseRows, supplements[category], needed, category)];
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
    if (!seen.has(row[0]) && isSafeQuestionRow(row)) {
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
    (question) => rephraseQuestion(question, "What is the correct response"),
    (question) => rephraseQuestion(question, "Which option would you choose"),
    (question) => rephraseQuestion(question, "What answer completes this"),
    (question) => rephraseQuestion(question, "Which choice is right"),
    (question) => rephraseQuestion(question, "What is the best answer"),
    (question) => rephraseQuestion(question, "Which response is correct"),
    (question) => rephraseQuestion(question, "How would you answer this"),
    (question) => rephraseQuestion(question, "What should the answer be"),
    (question) => rephraseQuestion(question, "Which option matches"),
    (question) => rephraseQuestion(question, "What is the right call"),
    (question) => rephraseQuestion(question, "Which answer is the fit")
  ];

  let variantIndex = 0;
  while (selected.length < needed) {
    const source = uniqueSupplements[variantIndex % uniqueSupplements.length];
    const makeQuestion = variants[Math.floor(variantIndex / uniqueSupplements.length) % variants.length];
    const variantQuestion = makeQuestion(source[0]);
    const variantRow = [variantQuestion, source[1], source[2], source[3]];
    if (!seen.has(variantQuestion) && isSafeQuestionRow(variantRow)) {
      selected.push([variantQuestion, source[1], source[2], source[3]]);
      seen.add(variantQuestion);
    }
    variantIndex += 1;
    if (variantIndex > uniqueSupplements.length * variants.length * 2) {
      throw new Error(`Could not generate enough ${category} supplement questions.`);
    }
  }

  return selected;
}

function isSafeQuestionRow([question, answer, distractors]) {
  return !containsText(question, answer) && !distractors.some((option) => optionConflicts(option, answer));
}

function rephraseQuestion(question, leadIn) {
  const trimmed = question.endsWith("?") ? question.slice(0, -1) : question;
  return `${leadIn}: ${lowerFirst(trimmed)}?`;
}

function lowerFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function possessive(value) {
  return value.endsWith("s") ? `${value}'` : `${value}'s`;
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
Magic Johnson|won five NBA championships with the Los Angeles Lakers|basketball
Larry Bird|won three straight NBA MVP awards in the 1980s|basketball
Shaquille O'Neal|won three straight NBA Finals MVP awards from 2000 to 2002|basketball
Tim Duncan|won five NBA championships with the San Antonio Spurs|basketball
Dirk Nowitzki|was named 2011 NBA Finals MVP with the Dallas Mavericks|basketball
Hakeem Olajuwon|won NBA MVP, Defensive Player of the Year and Finals MVP in 1994|basketball
Giannis Antetokounmpo|scored 50 points in the 2021 NBA Finals clincher|basketball
Nikola Jokic|became the first Denver Nuggets player to win NBA Finals MVP|basketball
Russell Westbrook|averaged a triple-double across an NBA season|basketball
Oscar Robertson|was the first NBA player to average a triple-double for a season|basketball
Diana Taurasi|became the WNBA's all-time leading scorer|basketball
Lisa Leslie|recorded the first dunk in WNBA history|basketball
Sue Bird|won four WNBA championships with the Seattle Storm|basketball
Lauren Jackson|won multiple WNBA MVP awards with the Seattle Storm|basketball
Serena Williams|won 23 Grand Slam singles titles|tennis
Margaret Court|won 24 Grand Slam singles titles|tennis
Roger Federer|won eight Wimbledon men's singles titles|tennis
Rafael Nadal|won 14 French Open men's singles titles|tennis
Novak Djokovic|completed a career Golden Masters in men's singles|tennis
Steffi Graf|completed the 1988 Golden Slam|tennis
Martina Navratilova|won 18 Grand Slam singles titles|tennis
Billie Jean King|won 39 Grand Slam titles across singles, doubles and mixed doubles|tennis
Iga Swiatek|won the 2020 French Open as an unseeded teenager|tennis
Usain Bolt|set the men's 100 metre world record at 9.58 seconds|athletics
Usain Bolt|set the men's 200 metre world record at 19.19 seconds|athletics
Florence Griffith-Joyner|set the women's 100 metre world record at 10.49 seconds|athletics
Shelly-Ann Fraser-Pryce|won Olympic 100 metres gold in 2008 and 2012|athletics
Allyson Felix|became the most decorated American track and field Olympian|athletics
Jackie Joyner-Kersee|won two Olympic heptathlon gold medals|athletics
Fanny Blankers-Koen|won four athletics gold medals at the 1948 Olympics|athletics
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
Mia Hamm|won two FIFA Women's World Cups with the United States|football
Megan Rapinoe|won the Golden Ball at the 2019 FIFA Women's World Cup|football
Alex Morgan|scored five goals in one match at the 2019 FIFA Women's World Cup|football
Christine Sinclair|became international football's all-time leading goalscorer|football
Sachin Tendulkar|became the first cricketer to score 100 international centuries|cricket
Sachin Tendulkar|played a record 200 Test matches|cricket
Brian Lara|scored 400 not out in a Test innings|cricket
Muttiah Muralitharan|became the first bowler to take 800 Test wickets|cricket
Shane Warne|took more than 700 Test wickets with leg spin|cricket
Don Bradman|finished with a Test batting average of 99.94|cricket
Lewis Hamilton|matched Michael Schumacher with seven Formula 1 world titles|Formula 1
Michael Schumacher|won seven Formula 1 world championships|Formula 1
Max Verstappen|won a record 19 Formula 1 races in the 2023 season|Formula 1
Ayrton Senna|won three Formula 1 world championships with McLaren|Formula 1
Sebastian Vettel|won four consecutive Formula 1 world championships from 2010 to 2013|Formula 1
Fernando Alonso|won Formula 1 world championships in 2005 and 2006|Formula 1
Alain Prost|won four Formula 1 world championships|Formula 1
Niki Lauda|won three Formula 1 world championships|Formula 1
Valentino Rossi|won seven premier-class motorcycle Grand Prix world titles|MotoGP
Tiger Woods|completed the 'Tiger Slam' across 2000 and 2001|golf
Jack Nicklaus|won a record 18 men's major golf championships|golf
Rory McIlroy|completed golf's career Grand Slam at the Masters|golf
Annika Sorenstam|won 10 women's major golf championships|golf
Kelly Slater|won 11 world surfing titles|surfing
Lance Franklin|kicked his 1,000th AFL goal in 2022|Australian rules football
Gary Ablett Jr.|won two Brownlow Medals|Australian rules football
Brent Harvey|played a VFL/AFL record 432 games|Australian rules football
Tony Lockett|finished as the VFL/AFL's all-time leading goalkicker|Australian rules football
Dustin Martin|won three Norm Smith Medals|Australian rules football
Patrick Dangerfield|won the 2016 Brownlow Medal|Australian rules football
Michael Tuck|played in seven VFL/AFL premiership teams|Australian rules football
Joel Selwood|captained Geelong to the 2022 AFL premiership|Australian rules football
Nat Fyfe|won Brownlow Medals in 2015 and 2019|Australian rules football
Adam Goodes|won Brownlow Medals in 2003 and 2006|Australian rules football
Robert Harvey|won back-to-back Brownlow Medals in 1997 and 1998|Australian rules football
Simon Black|won the Brownlow Medal, Norm Smith Medal and a premiership medal|Australian rules football
Erin Phillips|won the first AFLW best and fairest award|Australian rules football
Jason Dunstall|kicked more than 1,200 VFL/AFL goals|Australian rules football
Cameron Smith|became the first NRL player to reach 400 first-grade games|rugby league
Johnathan Thurston|won four Dally M Medals|rugby league
Cameron Smith|retired with 430 NRL appearances|rugby league
Cameron Smith|retired as the NRL's all-time leading point-scorer|rugby league
Billy Slater|won the 2011 Dally M Medal|rugby league
Cooper Cronk|won Dally M Medals in 2013 and 2016|rugby league
Andrew Johns|won three Dally M Medals|rugby league
Darren Lockyer|retired with 355 NRL premiership appearances|rugby league
Nathan Cleary|won the Clive Churchill Medal in the 2021 NRL Grand Final|rugby league
James Tedesco|won the 2019 Dally M Medal|rugby league
Ben Barba|won the 2012 Dally M Medal|rugby league
Roger Tuivasa-Sheck|won the 2018 Dally M Medal|rugby league
Kalyn Ponga|won the 2023 Dally M Medal|rugby league
Brad Fittler|captained New South Wales in State of Origin and Australia in Tests|rugby league
Richie McCaw|captained New Zealand to Rugby World Cup wins in 2011 and 2015|rugby union
Jonah Lomu|became a breakout star at the 1995 Rugby World Cup|rugby union
Andrew Gaze|won a record seven NBL MVP awards|NBL basketball
Andrew Gaze|finished as the NBL's all-time leading scorer|NBL basketball
Bryce Cotton|won his fifth NBL MVP award for the 2024/25 season|NBL basketball
Perth Wildcats|won their 10th NBL championship in 2020|NBL basketball|team
Sydney Kings|won three straight NBL championships from 2003 to 2005|NBL basketball|team
New Zealand Breakers|won three straight NBL championships from 2011 to 2013|NBL basketball|team
Melbourne United|won the 2018 NBL championship|NBL basketball|team
Adelaide 36ers|won the 1986 NBL championship with a 24-2 regular-season record|NBL basketball|team
Leroy Loggins|became one of the NBL's all-time great scorers|NBL basketball
Chris Anstey|won both NBL MVP and Grand Final MVP honours in 2005/06|NBL basketball
Liz Ellis|became one of Australia's most-capped netballers|netball
Caitlin Bassett|captained Australia to the 2019 Netball World Cup silver medal|netball
Irene van Dyk|became one of international netball's most prolific shooters|netball
Sharelle McMahon|starred for Australia in the 1999 Netball World Cup final|netball
Laura Geitz|captained Australia to the 2015 Netball World Cup title|netball
Gretel Bueta|was named MVP of the 2022 Commonwealth Games netball final|netball
Chris Lynn|became the Big Bash League's leading run-scorer|Big Bash cricket
Aaron Finch|made an unbeaten 111 for the Melbourne Renegades in BBL 02|Big Bash cricket
Perth Scorchers|became the first Big Bash League club to win five titles|Big Bash cricket|team
Sydney Sixers|won back-to-back BBL titles in BBL 09 and BBL 10|Big Bash cricket|team
Brisbane Heat|won the BBL 02 title|Big Bash cricket|team
Adelaide Strikers|won the BBL 07 title|Big Bash cricket|team
Melbourne Renegades|won the BBL 08 title|Big Bash cricket|team
Sydney Thunder|won the BBL 05 title|Big Bash cricket|team
Rashid Khan|took a Big Bash League hat-trick for the Adelaide Strikers|Big Bash cricket
Dan Christian|became known for winning T20 titles across multiple leagues|Big Bash cricket
Cathy Freeman|won the women's 400 metres at the Sydney 2000 Olympics|Australian Olympic history
Ian Thorpe|won three gold medals at the Sydney 2000 Olympics|Australian Olympic history
Emma McKeon|won seven medals at the Tokyo 2020 Olympics|Australian Olympic history
Dawn Fraser|won the women's 100 metres freestyle at three consecutive Olympics|Australian Olympic history
Betty Cuthbert|won four Olympic gold medals across sprint events|Australian Olympic history
Ariarne Titmus|beat Katie Ledecky in the 400 metres freestyle at Tokyo 2020|Australian Olympic history
Jessica Fox|won Olympic gold in canoe slalom at Tokyo 2020|Australian Olympic history
Anna Meares|won Olympic cycling gold in 2004 and 2012|Australian Olympic history
Kieren Perkins|won back-to-back Olympic 1500 metres freestyle gold medals|Australian Olympic history
Steven Bradbury|won Australia's first Winter Olympic gold medal|Australian Olympic history
Mack Horton|won Olympic 400 metres freestyle gold at Rio 2016|Australian Olympic history
Sally Pearson|won Olympic 100 metres hurdles gold at London 2012|Australian Olympic history
`);

  return [
    ...milestoneRows(milestones),
    ...rowsFrom(teamVenues, ([team]) => `Which venue is strongly associated with ${team}?`, ([, venue]) => venue, ([, venue]) => venue),
    ...rowsFrom(teamVenues, ([team]) => `What is the home venue most associated with ${team}?`, ([, venue]) => venue, ([, venue]) => venue),
    ...rowsFrom(teamVenues, ([team]) => `Where would ${team} most famously play home matches?`, ([, venue]) => venue, ([, venue]) => venue),
    ...rowsFrom(teamVenues, ([team, venue]) => `${venue} is strongly associated with which team?`, ([team]) => team, ([team]) => team),
    ...rowsFrom(athletes, ([athlete]) => `Which sport is ${athlete} best known for?`, ([, sport]) => sport, ([, sport]) => sport),
    ...rowsFrom(athletes, ([athlete]) => `${athlete} made their name in which sport?`, ([, sport]) => sport, ([, sport]) => sport),
    ...rowsFrom(athletes, ([athlete]) => `What sport would you connect with ${athlete}?`, ([, sport]) => sport, ([, sport]) => sport),
    ...rowsFrom(eventWinners, ([event]) => `Who won the ${event}?`, ([, winner]) => winner, ([, winner]) => winner),
    ...rowsFrom(eventWinners, ([event]) => `Which team or country claimed the ${event}?`, ([, winner]) => winner, ([, winner]) => winner),
    ...rowsFrom(terms, ([term]) => `In which sport would you hear the term '${term}'?`, ([, sport]) => sport, ([, sport]) => sport),
    ...rowsFrom(terms, ([term]) => `The term '${term}' belongs most naturally to which sport?`, ([, sport]) => sport, ([, sport]) => sport),
    ...rowsFrom(hosts, ([event]) => `Which city hosted the ${event}?`, ([, city]) => city, ([, city]) => city),
    ...rowsFrom(hosts, ([event]) => `Where was the ${event} held?`, ([, city]) => city, ([, city]) => city),
    ...rowsFrom(trophies, ([trophy]) => `The ${trophy} is associated with which sport?`, ([, sport]) => sport, ([, sport]) => sport),
    ...rowsFrom(trophies, ([trophy]) => `Which sport awards or contests the ${trophy}?`, ([, sport]) => sport, ([, sport]) => sport)
  ];
}

function milestoneRows(facts) {
  const typedFacts = facts.map(([subject, achievement, sport, entityType, gender]) => [
    subject,
    achievement,
    sport,
    entityType || "person",
    gender || inferSportFactGender(subject, achievement, sport, entityType || "person")
  ]);
  const bySportAndType = groupRows(typedFacts, ([, , sport, entityType, gender]) => `${sport}|${entityType}|${gender}`);
  const subjectTemplates = [
    ([subject, achievement, sport], noun) => [`Which ${sport} ${noun} ${achievement}?`, subject],
    ([subject, achievement, sport], noun) => [`In ${sport}, which ${noun} is linked to this achievement: ${achievement}?`, subject],
    ([subject, achievement, sport], noun) => [`The ${sport} milestone '${achievement}' belongs to which ${noun}?`, subject],
    ([subject, achievement, sport], noun) => [`Which ${sport} ${noun} is linked with this achievement: ${achievement}?`, subject],
    ([subject, achievement, sport], noun) => [`Which ${sport} ${noun} is the answer for this milestone: ${achievement}?`, subject],
    ([subject, achievement, sport], noun) => [`Which ${sport} ${noun} is known for this feat: ${achievement}?`, subject],
    ([subject, achievement, sport], noun) => [`Which ${noun} achieved this in ${sport}: ${achievement}?`, subject],
    ([subject, achievement, sport], noun) => [`Which ${sport} ${noun} should be matched to '${achievement}'?`, subject],
    ([subject, achievement, sport], noun) => [`Name the ${sport} ${noun} linked to this feat: ${achievement}.`, subject],
    ([subject, achievement, sport], noun) => [`Which ${sport} ${noun} is connected to the record or feat '${achievement}'?`, subject],
    ([subject, achievement, sport], noun) => [`Which ${sport} ${noun} is the correct option for '${achievement}'?`, subject],
    ([subject, achievement, sport], noun) => [`Which ${sport} ${noun} owns this trivia clue: ${achievement}?`, subject]
  ];
  const achievementTemplates = [
    ([subject, achievement, sport]) => [`What ${sport} achievement is ${subject} known for?`, achievement],
    ([subject, achievement, sport]) => [`Which milestone belongs to ${subject} in ${sport}?`, achievement],
    ([subject, achievement, sport]) => [`In ${sport}, which feat is tied to ${subject}?`, achievement],
    ([subject, achievement, sport]) => [`Which ${sport} record or achievement is associated with ${subject}?`, achievement],
    ([subject, achievement, sport]) => [`What did ${subject} do in ${sport}?`, achievement],
    ([subject, achievement, sport]) => [`Choose the ${sport} milestone linked to ${subject}.`, achievement],
    ([subject, achievement, sport]) => [`Which statement best describes ${possessive(subject)} ${sport} achievement?`, achievement],
    ([subject, achievement, sport]) => [`What is ${possessive(subject)} notable ${sport} milestone?`, achievement],
    ([subject, achievement, sport]) => [`Which ${sport} feat should be matched with ${subject}?`, achievement],
    ([subject, achievement, sport]) => [`What record or feat makes ${subject} a ${sport} trivia answer?`, achievement],
    ([subject, achievement, sport]) => [`Which ${sport} achievement completes the clue for ${subject}?`, achievement],
    ([subject, achievement, sport]) => [`What is the best ${sport} milestone match for ${subject}?`, achievement]
  ];

  return typedFacts.flatMap((fact, index) => {
    const [person, achievement, sport, entityType, gender] = fact;
    const sportFacts = bySportAndType.get(`${sport}|${entityType}|${gender}`) || [];
    const people = unique(sportFacts.map(([person]) => person));
    const achievements = unique(sportFacts.map(([, achievement]) => achievement));
    if (people.length < 4 || achievements.length < 4) return [];
    const forbiddenPeople = mentionedPoolItems(achievement, people).filter((item) => item !== person);
    const meta = (subject) => ({
      sportContext: sport,
      sportEntityType: entityType,
      sportGender: gender,
      sportScopedOptions: true,
      subject,
      factKey: `sport-milestone|${normalizeText(sport)}|${entityType}|${gender}|${normalizeText(person)}|${normalizeText(achievement)}`
    });
    const subjectNoun = entityType === "team" ? "side" : "name";
    const subjectRows = subjectTemplates.map((template, templateIndex) => {
        const [question, answer] = template(fact, subjectNoun);
        return [question, answer, pickDistractors(answer, people, index + templateIndex, forbiddenPeople), meta(answer)];
      });
    const safeAchievements = achievements.filter((item) => !containsText(item, person));
    const achievementRows = safeAchievements.length < 4 ? [] : achievementTemplates.map((template, templateIndex) => {
        const [question, answer] = template(fact);
        return [question, answer, pickDistractors(answer, safeAchievements, index + templateIndex), meta(person)];
      });
    return [...subjectRows, ...achievementRows];
  });
}

const FEMALE_SPORT_SUBJECTS = new Set([
  "Diana Taurasi",
  "Lisa Leslie",
  "Sue Bird",
  "Lauren Jackson",
  "Serena Williams",
  "Margaret Court",
  "Steffi Graf",
  "Martina Navratilova",
  "Billie Jean King",
  "Iga Swiatek",
  "Florence Griffith-Joyner",
  "Shelly-Ann Fraser-Pryce",
  "Allyson Felix",
  "Jackie Joyner-Kersee",
  "Fanny Blankers-Koen",
  "Katie Ledecky",
  "Simone Biles",
  "Nadia Comaneci",
  "Marta",
  "Mia Hamm",
  "Megan Rapinoe",
  "Alex Morgan",
  "Christine Sinclair",
  "Annika Sorenstam",
  "Erin Phillips",
  "Liz Ellis",
  "Caitlin Bassett",
  "Irene van Dyk",
  "Sharelle McMahon",
  "Laura Geitz",
  "Gretel Bueta",
  "Cathy Freeman",
  "Emma McKeon",
  "Dawn Fraser",
  "Betty Cuthbert",
  "Ariarne Titmus",
  "Jessica Fox",
  "Anna Meares",
  "Sally Pearson"
]);

function inferSportFactGender(subject, achievement, sport, entityType) {
  if (entityType !== "person") return "team";
  const text = normalizeText(`${subject} ${achievement} ${sport}`);
  if (FEMALE_SPORT_SUBJECTS.has(subject) || /\b(women|woman|female|wnba|aflw|netball)\b/.test(text)) return "female";
  if (/\b(men|mens|male|nba|nfl|mlb|nhl|nrl)\b/.test(text)) return "male";
  return "open";
}

function mentionedPoolItems(text, pool) {
  return pool.filter((item) => containsText(text, item));
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
    ...rowsFrom(songArtists, ([song, artist]) => `Which song was a hit for ${artist}?`, ([song]) => song, ([song]) => song, sameGroupValues(songArtists, ([, artist]) => artist, ([song]) => song)),
    ...rowsFrom(songArtists, ([song, artist]) => `${artist} is strongly associated with which track titled '${song}'?`, ([song]) => song, ([song]) => song, sameGroupValues(songArtists, ([, artist]) => artist, ([song]) => song)),
    ...rowsFrom(albumArtists, ([album]) => `Which artist released the album '${album}'?`, ([, artist]) => artist, ([, artist]) => artist),
    ...rowsFrom(albumArtists, ([album]) => `'${album}' is an album by which act?`, ([, artist]) => artist, ([, artist]) => artist),
    ...rowsFrom(albumArtists, ([album, artist]) => `Which album is associated with ${artist}?`, ([album]) => album, ([album]) => album, sameGroupValues(albumArtists, ([, artist]) => artist, ([album]) => album)),
    ...rowsFrom(albumArtists, ([album, artist]) => `${artist} released which album named '${album}'?`, ([album]) => album, ([album]) => album, sameGroupValues(albumArtists, ([, artist]) => artist, ([album]) => album)),
    ...rowsFrom(leadSingers, ([band]) => `Who was the lead singer of ${band}?`, ([, singer]) => singer, ([, singer]) => singer),
    ...rowsFrom(leadSingers, ([band]) => `${band} is closely associated with which frontperson?`, ([, singer]) => singer, ([, singer]) => singer),
    ...rowsFrom(leadSingers, ([band, singer]) => `${singer} fronted which band?`, ([band]) => band, ([band]) => band, sameGroupValues(leadSingers, ([, singer]) => singer, ([band]) => band)),
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
    ...rowsFrom(filmDirectors, ([film, director]) => `Which film is associated with director ${director}?`, ([film]) => film, ([film]) => film, sameGroupValues(filmDirectors, ([, director]) => director, ([film]) => film)),
    ...rowsFrom(filmDirectors, ([film, director]) => `${director} directed which film titled '${film}'?`, ([film]) => film, ([film]) => film, sameGroupValues(filmDirectors, ([, director]) => director, ([film]) => film)),
    ...rowsFrom(books, ([book]) => `Who wrote '${book}'?`, ([, author]) => author, ([, author]) => author),
    ...rowsFrom(books, ([book]) => `Which author wrote the book '${book}'?`, ([, author]) => author, ([, author]) => author),
    ...rowsFrom(books, ([book, author]) => `Which book is by ${author}?`, ([book]) => book, ([book]) => book, sameGroupValues(books, ([, author]) => author, ([book]) => book)),
    ...rowsFrom(books, ([book, author]) => `${author} wrote which work titled '${book}'?`, ([book]) => book, ([book]) => book, sameGroupValues(books, ([, author]) => author, ([book]) => book)),
    ...rowsFrom(tvSettings, ([show]) => `Where is '${show}' primarily set?`, ([, setting]) => setting, ([, setting]) => setting),
    ...rowsFrom(tvSettings, ([show, setting]) => `Which TV show is primarily set in ${setting}?`, ([show]) => show, ([show]) => show, sameGroupValues(tvSettings, ([, setting]) => setting, ([show]) => show)),
    ...rowsFrom(tvSettings, ([show]) => `The setting of '${show}' is most associated with which place?`, ([, setting]) => setting, ([, setting]) => setting),
    ...rowsFrom(characters, ([character]) => `Which actor played ${character}?`, ([, actor]) => actor, ([, actor]) => actor),
    ...rowsFrom(characters, ([character, actor]) => `${actor} played which character?`, ([character]) => character, ([character]) => character, sameGroupValues(characters, ([, actor]) => actor, ([character]) => character)),
    ...rowsFrom(characters, ([character]) => `Who is the performer behind ${character}?`, ([, actor]) => actor, ([, actor]) => actor),
    ...rowsFrom(facts, ([prompt]) => `What completes this film, TV, or book clue: ${prompt}?`, ([, answer]) => answer, ([, answer]) => answer),
    ...rowsFrom(facts, ([prompt]) => `Which answer fits this culture clue: ${prompt}?`, ([, answer]) => answer, ([, answer]) => answer)
  ];
}

function buildGeneralRows() {
  const historyEvents = list(`
World War I|began after the 1914 assassination of Archduke Franz Ferdinand in Sarajevo|Britannica World War I
the French Revolution|is strongly linked with the storming of the Bastille in 1789|Britannica Bastille
the Industrial Revolution|first took hold in Britain in the 18th century|Britannica Industrial Revolution
Apollo 11|landed humans on the Moon in 1969|NASA Apollo 11
Magna Carta|was sealed by King John at Runnymede in 1215|National Archives Magna Carta
the Declaration of Independence|was adopted by the Continental Congress on 4 July 1776|National Archives Declaration of Independence
the Berlin Wall|fell in 1989 after decades as a Cold War symbol|Britannica Berlin Wall
the Rosetta Stone|helped scholars decode Egyptian hieroglyphs|British Museum Rosetta Stone
smallpox eradication|was declared by the World Health Organization in 1980|WHO smallpox
the first modern Olympic Games|were held in Athens in 1896|Olympics history
the Wright brothers' first flight|took place at Kitty Hawk in 1903|Smithsonian aviation
the Cuban Missile Crisis|brought the United States and Soviet Union into a 1962 nuclear standoff|Britannica Cuban Missile Crisis
the Suez Canal opening|created a sea route between the Mediterranean and Red Sea in 1869|Suez Canal Authority
the Treaty of Versailles|formally ended World War I between Germany and the Allied powers|Britannica Treaty of Versailles
the Battle of Hastings|was fought in England in 1066|Britannica Battle of Hastings
the Meiji Restoration|transformed Japan's government in the late 19th century|Britannica Meiji Restoration
the Renaissance|saw a major revival of classical learning and art in Europe|Britannica Renaissance
the Black Death|devastated Europe in the 14th century|Britannica Black Death
the D-Day landings|began the Allied invasion of Normandy in 1944|Imperial War Museums D-Day
the Boston Tea Party|was a colonial protest involving tea dumped into Boston Harbor|Britannica Boston Tea Party
the Opium Wars|were 19th-century conflicts involving Britain and China|Britannica Opium Wars
the American Civil War|was fought between the Union and the Confederacy|National Park Service Civil War
the Russian Revolution|overthrew the Romanov monarchy in 1917|Britannica Russian Revolution
the Eureka Stockade|was an 1854 goldfields rebellion in Victoria|National Museum of Australia Eureka Stockade
Australian federation|created the Commonwealth of Australia in 1901|Parliament of Australia federation
the Gallipoli campaign|is central to Anzac commemoration in Australia and New Zealand|Australian War Memorial Gallipoli
decimal currency in Australia|was introduced on 14 February 1966|Royal Australian Mint decimal currency
the Mabo decision|recognised native title in Australian law|National Museum of Australia Mabo
the Stolen Generations apology|was delivered by the Australian Prime Minister in 2008|Parliament of Australia apology
the Snowy Mountains Scheme|became a landmark postwar Australian engineering project|National Museum of Australia Snowy Scheme
`);

  const scienceNature = list(`
Jupiter|is the largest planet in the Solar System|NASA Jupiter
Challenger Deep|is the deepest known part of Earth's oceans|NOAA ocean depth
the Ring of Fire|partly encircles the Pacific Basin with frequent earthquakes and volcanoes|USGS Ring of Fire
Pangaea|was a supercontinent whose name means all the Earth|Britannica Pangaea
the periodic table|organises chemical elements by atomic number|Royal Society of Chemistry periodic table
helium|is the chemical element named from the Greek word for the Sun|Royal Society of Chemistry helium
DNA|carries genetic information in living organisms|NIH genetics
photosynthesis|is the process by which plants use light to make sugars|Britannica photosynthesis
the Amazon rainforest|is the world's largest tropical rainforest|WWF Amazon
the Sahara|is the world's largest hot desert|Britannica Sahara
Mount Everest|is Earth's highest mountain above sea level|Britannica Everest
the Nile|is commonly listed among the world's longest rivers|Britannica Nile
Lake Baikal|is the world's deepest freshwater lake|UNESCO Lake Baikal
the Great Barrier Reef|is the world's largest coral reef system|UNESCO Great Barrier Reef
Uluru|is a sandstone monolith in Australia's Northern Territory|Parks Australia Uluru
the platypus|is an egg-laying mammal known as a monotreme|Australian Museum platypus
the echidna|is an Australian egg-laying mammal|Australian Museum monotremes
the dingo|is a wild canid found in Australia|Australian Museum dingo
the ozone layer|absorbs much of the Sun's ultraviolet radiation|NASA ozone
the Mariana Trench|lies in the western Pacific Ocean|NOAA Mariana Trench
the Great Red Spot|is a long-lived storm on Jupiter|NASA Jupiter
Halley's Comet|is visible from Earth roughly every 76 years|NASA comet facts
the asteroid belt|lies mainly between Mars and Jupiter|NASA asteroid belt
the Southern Cross|is a constellation shown on the Australian flag|Australian National Flag
the Pacific Ocean|is the world's largest ocean|NOAA ocean facts
the Dead Sea|is famous for extremely salty water|Britannica Dead Sea
Victoria Falls|is a waterfall on the Zambezi River|UNESCO Victoria Falls
the Galapagos Islands|are associated with Charles Darwin's observations|UNESCO Galapagos
the monsoon|is a seasonal wind pattern bringing wet and dry seasons|Britannica monsoon
El Nino|is a warming phase of the tropical Pacific climate cycle|NOAA El Nino
`);

  const inventionsMedicine = list(`
penicillin|was discovered by Alexander Fleming in 1928|Britannica penicillin
the telephone|is associated with Alexander Graham Bell's 1876 patent|Library of Congress telephone
the printing press|was developed in Europe by Johannes Gutenberg|Britannica Gutenberg
the World Wide Web|was invented by Tim Berners-Lee at CERN|CERN World Wide Web
the black box flight recorder|was invented by Australian scientist David Warren|National Museum of Australia black box
Wi-Fi technology|has important Australian CSIRO patent history|CSIRO Wi-Fi
the cochlear implant|is strongly linked with Australian scientist Graeme Clark|National Museum of Australia cochlear implant
the bionic ear|is another name often used for the cochlear implant|National Museum of Australia cochlear implant
the first successful vaccine|was Edward Jenner's smallpox vaccine|WHO vaccination history
insulin|was first used successfully as a diabetes treatment in the early 1920s|Nobel Prize insulin
X-rays|were discovered by Wilhelm Roentgen in 1895|Nobel Prize Roentgen
radioactivity|was a field pioneered by Marie Curie|Nobel Prize Marie Curie
the polio vaccine|is closely associated with Jonas Salk|History of Vaccines polio
the barcode|uses machine-readable lines to identify products|Smithsonian barcode
GPS|uses satellites for positioning and navigation|NASA GPS
the steam engine|was improved by James Watt during the Industrial Revolution|Britannica James Watt
the light bulb|is famously associated with Thomas Edison|Smithsonian Edison
the aeroplane|was first flown successfully by the Wright brothers|Smithsonian Wright brothers
the microscope|made tiny organisms and cells visible to scientists|Britannica microscope
the telescope|was used by Galileo for astronomical observations|Britannica telescope
the battery|was pioneered by Alessandro Volta|Britannica Volta
the pasteurisation process|is named after Louis Pasteur|Britannica Pasteur
the periodic law|is associated with Dmitri Mendeleev|Britannica Mendeleev
the Turing machine|is a theoretical computing model associated with Alan Turing|Britannica Turing machine
the first programmable computer|is often linked with Charles Babbage's Analytical Engine|Britannica Analytical Engine
the transistor|helped make modern electronics smaller and more reliable|Nobel Prize transistor
the laser|stands for light amplification by stimulated emission of radiation|Britannica laser
the Hubble Space Telescope|was launched into orbit in 1990|NASA Hubble
the International Space Station|orbits Earth as a multinational laboratory|NASA ISS
the James Webb Space Telescope|observes space mainly in infrared light|NASA Webb
`);

  const documentsCulture = list(`
The Odyssey|is an ancient Greek epic traditionally attributed to Homer|Britannica Odyssey
Pride and Prejudice|was written by Jane Austen|Britannica Jane Austen
Frankenstein|was written by Mary Shelley|British Library Frankenstein
Nineteen Eighty-Four|was written by George Orwell|British Library George Orwell
Don Quixote|was written by Miguel de Cervantes|Britannica Don Quixote
The Great Gatsby|was written by F. Scott Fitzgerald|Britannica Great Gatsby
Hamlet|features Shakespeare's Prince of Denmark|Britannica Hamlet
Mona Lisa|is a portrait painted by Leonardo da Vinci|Louvre Mona Lisa
The Starry Night|is a painting by Vincent van Gogh|MoMA Starry Night
the Sistine Chapel ceiling|was painted by Michelangelo|Vatican Museums Sistine Chapel
the Nobel Peace Prize|is awarded in Oslo|Nobel Prize facts
the Pulitzer Prize|is associated with journalism, literature and music in the United States|Pulitzer Prize
the Booker Prize|is a major literary prize for fiction|Booker Prize
the Academy Awards|are also known as the Oscars|Academy Awards
the Eurovision Song Contest|is a long-running international song competition|Eurovision history
the haka|is a ceremonial Maori performance known worldwide through New Zealand sport|Te Ara haka
the didgeridoo|is a wind instrument associated with Aboriginal Australian cultures|Australian Museum didgeridoo
boomerang|is a throwing tool strongly associated with Aboriginal Australia|National Museum of Australia boomerang
NAIDOC Week|celebrates Aboriginal and Torres Strait Islander histories and cultures|NAIDOC official
Anzac Day|is observed on 25 April in Australia and New Zealand|Australian War Memorial Anzac Day
the Archibald Prize|is a famous Australian portrait prize|Art Gallery of NSW Archibald
the Miles Franklin Award|is a major Australian literary award|State Library NSW Miles Franklin
the Booker winner Life of Pi|was written by Yann Martel|Booker Prize Life of Pi
the Rosetta Stone|contains Greek, demotic and hieroglyphic text|British Museum Rosetta Stone
the Bayeux Tapestry|depicts events around the Norman Conquest of England|Bayeux Museum
`);

  const worldGeography = list(`
Machu Picchu|is an Inca site high in the Andes of Peru|UNESCO Machu Picchu
Petra|is a rock-cut archaeological city in Jordan|UNESCO Petra
Angkor Wat|is a temple complex in Cambodia|UNESCO Angkor
the Eiffel Tower|was built in Paris for the 1889 Exposition Universelle|Britannica Eiffel Tower
the Prime Meridian|passes through Greenwich in London|Royal Museums Greenwich
the Suez Canal|links the Mediterranean Sea and the Red Sea|Suez Canal Authority
the Panama Canal|links the Atlantic and Pacific oceans through Panama|Panama Canal Authority
Mount Kilimanjaro|is Africa's highest mountain|Britannica Kilimanjaro
the Atacama Desert|lies mainly in northern Chile|Britannica Atacama
the Gobi Desert|spans parts of Mongolia and China|Britannica Gobi
Patagonia|is a region shared by Argentina and Chile|Britannica Patagonia
Santorini|is a Greek island in the Aegean Sea|Britannica Santorini
Dubrovnik|is a walled city on Croatia's Adriatic coast|UNESCO Dubrovnik
Istanbul|sits on the Bosporus between Europe and Asia|Britannica Istanbul
the Serengeti|is famous for wildlife migration in East Africa|UNESCO Serengeti
Yellowstone|was established as the first U.S. national park|National Park Service Yellowstone
Banff|is a national park in the Canadian Rockies|Parks Canada Banff
Table Mountain|overlooks Cape Town in South Africa|South African National Parks
the Amazon River|flows across northern South America|Britannica Amazon River
the Mekong River|flows through mainland Southeast Asia|Mekong River Commission
the Danube|flows through or along several European countries|Britannica Danube
the Rhine|is a major river of western Europe|Britannica Rhine
the Himalayas|include many of the world's highest mountains|Britannica Himalayas
the Maldives|is an island nation in the Indian Ocean|Britannica Maldives
Madagascar|is a large island off Africa's southeast coast|Britannica Madagascar
Iceland|sits on the Mid-Atlantic Ridge|Britannica Iceland
New Zealand|is made up mainly of the North Island and South Island|Britannica New Zealand
Tasmania|is Australia's island state|Britannica Tasmania
Kakadu National Park|is in Australia's Northern Territory|UNESCO Kakadu
Rottnest Island|is known for quokkas off Western Australia|Rottnest Island Authority
`);

  const everydayTrivia = list(`
the cheetah|is commonly described as the fastest land animal|National Geographic cheetah
the blue whale|is the largest animal known to have lived on Earth|NOAA blue whale
honey|is made by bees from nectar|Smithsonian bees
saffron|is a spice harvested from crocus flowers|Britannica saffron
sushi|is strongly associated with Japanese cuisine|Britannica sushi
pizza|has roots in Italian food culture|Britannica pizza
espresso|is a concentrated coffee style from Italy|Britannica coffee
champagne|is sparkling wine from a region of France|Britannica Champagne
the Celsius scale|sets water's freezing point at 0 degrees under standard conditions|Britannica Celsius
the Richter scale|was developed to measure earthquake magnitude|Britannica Richter scale
Morse code|uses dots and dashes for communication|Britannica Morse Code
Braille|is a tactile writing system for blind and low-vision readers|Britannica Braille
the ampersand|is the symbol for the word and|Britannica ampersand
the ampere|is a unit of electric current|Britannica ampere
the kilogram|is the SI base unit of mass|BIPM SI units
the leap year|adds an extra day to keep calendars aligned with Earth's orbit|Britannica leap year
the solstice|marks one of the year's extreme points of daylight|Britannica solstice
the equinox|is when day and night are roughly equal in length|Britannica equinox
the metric system|is a decimal system of measurement|Britannica metric system
the Olympic rings|represent the Olympic movement with five interlaced rings|Olympics symbols
Australia's emergency number|is triple zero|Australian Government triple zero
the Royal Flying Doctor Service|provides medical care to remote Australia|Royal Flying Doctor Service
the Ghan|is a rail journey between Adelaide and Darwin|Journey Beyond Ghan
the Indian Pacific|is a rail journey across Australia between Sydney and Perth|Journey Beyond Indian Pacific
the Nullarbor|is named from Latin words meaning no trees|Britannica Nullarbor
Coober Pedy|is known for opal mining and underground homes|South Australian Tourism Coober Pedy
`);

  return [
    ...generalFactRows(historyEvents, "history"),
    ...generalFactRows(scienceNature, "science"),
    ...generalFactRows(inventionsMedicine, "inventions"),
    ...generalFactRows(documentsCulture, "culture"),
    ...generalFactRows(worldGeography, "geography"),
    ...generalFactRows(everydayTrivia, "everyday")
  ];
}

function generalFactRows(facts, theme) {
  const templates = [
    ([, clue]) => `What ${clue}?`,
    ([, clue]) => `Which answer matches this ${theme} fact: ${clue}?`,
    ([, clue]) => `Which answer is most closely linked with this fact: ${clue}?`,
    ([, clue]) => `What would a quizmaster expect for this fact: ${clue}?`,
    ([, clue]) => `Which option is associated with this fact: ${clue}?`,
    ([, clue]) => `What is the usual trivia answer for this fact: ${clue}?`,
    ([, clue]) => `Which answer belongs with this fact: ${clue}?`,
    ([, clue]) => `What is being described here: ${clue}?`,
    ([, clue]) => `Which answer best fits the fact that it ${clue}?`,
    ([, clue]) => `Which option should be matched with this fact: ${clue}?`,
    ([, clue]) => `What is the general-knowledge answer for this fact: ${clue}?`,
    ([, clue]) => `Which answer is tied to this fact: ${clue}?`,
    ([, clue]) => `What is the answer associated with this fact: ${clue}?`,
    ([, clue]) => `Which answer has this claim attached to it: ${clue}?`,
    ([, clue]) => `What is the correct answer for this fact: ${clue}?`,
    ([, clue]) => `Which answer is known for this fact: ${clue}?`,
    ([, clue]) => `Which answer is a strong match for this fact: ${clue}?`,
    ([, clue]) => `Which answer completes this general fact: ${clue}?`,
    ([, clue]) => `What answer is linked with the fact that it ${clue}?`,
    ([, clue]) => `Which answer is described by this fact: ${clue}?`,
    ([, clue]) => `What is the matching answer for this fact: ${clue}?`,
    ([, clue]) => `Which answer would you pair with this fact: ${clue}?`,
    ([, clue]) => `What answer goes with this fact: ${clue}?`,
    ([, clue]) => `Which answer is the best match for this fact: ${clue}?`,
    ([, clue]) => `What does this fact point to: ${clue}?`,
    ([, clue]) => `Which answer is identified by this fact: ${clue}?`,
    ([, clue]) => `What is named by this fact: ${clue}?`,
    ([, clue]) => `Which answer is the subject of this fact: ${clue}?`,
    ([, clue]) => `Which answer is usually linked with this fact: ${clue}?`
  ];

  return templates.flatMap((questionFn) =>
    rowsFrom(
      facts,
      questionFn,
      ([answer]) => answer,
      ([answer]) => answer,
      null,
      ([answer, clue, source]) => ({
        source,
        factKey: `general|${theme}|${normalizeText(answer)}|${normalizeText(clue)}`
      })
    )
  );
}

function rowsFrom(facts, questionFn, answerFn, poolFn, forbiddenFn = null, metaFn = null) {
  const pool = unique(facts.map(poolFn));
  return facts.map((fact, index) => {
    const answer = answerFn(fact);
    const forbidden = forbiddenFn ? forbiddenFn(fact).filter((item) => item !== answer) : [];
    return [questionFn(fact), answer, pickDistractors(answer, pool, index, forbidden), metaFn ? metaFn(fact) : undefined];
  });
}

function sourcedRowsFrom(facts, questionFn, answerFn, poolFn, sourceFn, forbiddenFn = null) {
  return rowsFrom(facts, questionFn, answerFn, poolFn, forbiddenFn, (fact) => ({ source: sourceFn(fact) }));
}

function sameGroupValues(facts, keyFn, valueFn) {
  const groups = groupRows(facts, keyFn);
  return (fact) => unique((groups.get(keyFn(fact)) || []).map(valueFn));
}

function pickDistractors(answer, pool, index, forbidden = []) {
  const choices = pool.filter((item) => {
    return !optionConflicts(item, answer) && !forbidden.some((term) => containsText(item, term));
  });
  if (choices.length < 3) {
    throw new Error(`Not enough distractors for ${answer}.`);
  }
  return [0, 1, 2].map((offset) => choices[(index + offset) % choices.length]);
}

function containsText(value, term) {
  return normalizeText(value).includes(normalizeText(term));
}

function optionConflicts(option, answer) {
  return option === answer || containsText(option, answer) || containsText(answer, option);
}

function normalizeText(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function unique(values) {
  return [...new Set(values)];
}

function groupRows(rows, keyFn) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    groups.set(key, [...(groups.get(key) || []), row]);
  }
  return groups;
}

function list(block) {
  return block
    .trim()
    .split("\n")
    .map((line) => line.trim().split("|"));
}

-- 1. Tabellen Aanmaken (Create Tables)

CREATE TABLE kds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crebonr INT NOT NULL,
    titel VARCHAR(255) NOT NULL,
    versie VARCHAR(50),
    geldig_vanaf DATE,
    mbo_niveau INT
);

CREATE TABLE kd_kerntaken (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kwalificatie_id INT,
    code VARCHAR(50) NOT NULL,
    titel VARCHAR(255) NOT NULL,
    FOREIGN KEY (kwalificatie_id) REFERENCES kds(id)
);

CREATE TABLE kd_werkprocessen (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kerntaak_id INT,
    code VARCHAR(50) NOT NULL,
    titel VARCHAR(255) NOT NULL,
    omschrijving TEXT,
    verwacht_resultaat TEXT,
    FOREIGN KEY (kerntaak_id) REFERENCES kd_kerntaken(id)
);

CREATE TABLE kd_gedrag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    werkproces_id INT,
    omschrijving TEXT NOT NULL,
    FOREIGN KEY (werkproces_id) REFERENCES kd_werkprocessen(id)
);

-- Masterlijst van competenties/vaardigheden
CREATE TABLE kd_competenties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    naam VARCHAR(255) NOT NULL UNIQUE
);

-- Koppel-tabel (Many-to-many) voor werkprocessen en competenties
CREATE TABLE kd_werkproces_competenties (
    werkproces_id INT,
    competentie_id INT,
    PRIMARY KEY (werkproces_id, competentie_id),
    FOREIGN KEY (werkproces_id) REFERENCES kd_werkprocessen(id),
    FOREIGN KEY (competentie_id) REFERENCES kd_competenties(id)
);


-- 2. Data Invoeren (Insert Data)

-- Kwalificatie invoeren
INSERT INTO kds (id, crebonr, titel, versie, geldig_vanaf, mbo_niveau) 
VALUES (1, 25998, 'Software developer', '2024', '2024-08-01', 4);

-- Kerntaken invoeren
INSERT INTO kd_kerntaken (id, kwalificatie_id, code, titel) VALUES 
(1, 1, 'B1-K1', 'Realiseert software'),
(2, 1, 'B1-K2', 'Voert ICT-projecten uit');

-- Werkprocessen invoeren
INSERT INTO kd_werkprocessen (id, kerntaak_id, code, titel, omschrijving, verwacht_resultaat) VALUES 
(1, 1, 'B1-K1-W1', 'Stemt opdracht af, plant werkzaamheden en bewaakt de voortgang', 'De beginnend beroepsbeoefenaar stemt af met de opdrachtgever/leidinggevende/belanghebbenden wat er ontwikkeld moet worden, welke doelen behaald moeten worden, en wanneer het klaar moet zijn. Tijdens het ontwikkelproces houdt de beginnend beroepsbeoefenaar bij wat is gedaan, welke taken nog uitgevoerd moeten worden en gaat na of de planning in gevaar komt.', 'Doelen en planning zijn afgestemd met de opdrachtgever/leidinggevende/belanghebbenden. De voortgang is bewaakt.'),
(2, 1, 'B1-K1-W2', 'Maakt een technisch ontwerp voor software', 'De beginnend beroepsbeoefenaar maakt een (deel) ontwerp dat aansluit op de geformuleerde eisen en wensen. Op basis van de informatie uit de opdracht en planning zet de beginnend beroepsbeoefenaar alternatieven voor het ontwerp naast elkaar en werkt het meest kansrijke alternatief uit.', 'Het (deel) ontwerp sluit aan op de geformuleerde eisen en wensen.'),
(3, 1, 'B1-K1-W3', 'Realiseert (onderdelen van) software', 'De beginnend beroepsbeoefenaar werkt aan het ontwikkelen van (onderdelen van) software voor het (deel) ontwerp. De beginnend beroepsbeoefenaar programmeert de software, schrijft de benodigde code en integreert waar nodig (aangeleverde) assets.', 'De software werkt en voldoet aan de opdracht, het ontwerp en de geldende code conventies.'),
(4, 1, 'B1-K1-W4', 'Test software', 'De beginnend beroepsbeoefenaar maakt testscenario''s voor het testen van de gerealiseerde software. De beginnend beroepsbeoefenaar kiest een passende testvorm, zoals eigen test van software, unit tests, integratietest, acceptatietest en kiest een passende testmethodiek.', 'De testactiviteiten zijn correct uitgevoerd en er zijn plausibele conclusies getrokken.'),
(5, 1, 'B1-K1-W5', 'Doet verbetervoorstellen voor de software', 'De beginnend beroepsbeoefenaar interpreteert wensen, reacties, testresultaten en/of meldingen van opdrachtgever/leidinggevende/belanghebbenden voor het aanpassen van (onderdelen van) software. De beginnend beroepsbeoefenaar vertaalt dit in een voorstel voor verbetering van de software.', 'Voorstellen voor verbetering van de software zijn afgestemd met de opdrachtgever/leidinggevende/belanghebbenden.'),
(6, 2, 'B1-K2-W1', 'Werkt samen in een projectteam', 'De beginnend beroepsbeoefenaar werkt samen met de leidinggevende en/of het projectteam, collega''s binnen de eigen organisatie en/of relevante belanghebbenden. De beginnend beroepsbeoefenaar informeert desgevraagd over de eigen werkzaamheden en resultaten.', 'De eigen werkzaamheden, resultaten en ideeën zijn gecommuniceerd, feedback is gevraagd en gegeven en afspraken zijn helder en worden nagekomen.'),
(7, 2, 'B1-K2-W2', 'Presenteert het opgeleverde werk', 'De beginnend beroepsbeoefenaar toont het opgeleverde (deel) product aan de opdrachtgever/leidinggevende/belanghebbenden, leidinggevende en/of het team. De beginnend beroepsbeoefenaar presenteert de functionaliteiten van het (deel) product en beantwoordt vragen.', 'Betrokkenen zijn goed geïnformeerd over het opgeleverde werk en de uitgevoerde werkzaamheden.'),
(8, 2, 'B1-K2-W3', 'Evalueert de samenwerking', 'De beginnend beroepsbeoefenaar draagt bij aan de evaluatie na oplevering van een (deel) product. Hierbij reflecteert die op de eigen prestaties, alsmede het teamproces en/of de werkwijze.', 'De eigen prestaties zijn geëvalueerd, alsmede het teamproces en/of de werkwijze.');

-- Competenties invoeren
INSERT INTO kd_competenties (id, naam) VALUES 
(1, 'Samenwerken en overleggen'),
(2, 'Analyseren'),
(3, 'Plannen en organiseren'),
(4, 'Onderzoeken'),
(5, 'Vakdeskundigheid toepassen'),
(6, 'Instructies en procedures opvolgen'),
(7, 'Op de behoeften en verwachtingen van de "klant" richten'),
(8, 'Kwaliteit leveren'),
(9, 'Met druk en tegenslag omgaan'),
(10, 'Formuleren en rapporteren'),
(11, 'Leren'),
(12, 'Presenteren');

-- Werkprocessen aan competenties koppelen
INSERT INTO kd_werkproces_competenties (werkproces_id, competentie_id) VALUES 
-- B1-K1-W1
(1, 1), (1, 2), (1, 3), (1, 4),
-- B1-K1-W2
(2, 5), (2, 6), (2, 7),
-- B1-K1-W3
(3, 1), (3, 5), (3, 8), (3, 6), (3, 9),
-- B1-K1-W4
(4, 10), (4, 5), (4, 2), (4, 6),
-- B1-K1-W5
(5, 1), (5, 2), (5, 3), (5, 5),
-- B1-K2-W1
(6, 1), (6, 10), (6, 6), (6, 11),
-- B1-K2-W2
(7, 12), (7, 5),
-- B1-K2-W3
(8, 1), (8, 11);

-- Gedrag (Behaviors) invoeren
INSERT INTO kd_gedrag (werkproces_id, omschrijving) VALUES 
(1, 'stemt zorgvuldig doelen en planning af met opdrachtgever/leidinggevende/belanghebbenden en vraagt door totdat alles duidelijk is.'),
(1, 'trekt logische conclusies uit de beschikbare informatie over de benodigde werkzaamheden en eventuele risico''s.'),
(1, 'stelt realistische doelen, prioriteiten en een realistisch tijdspad op voor de te realiseren software(onderdelen).'),
(1, 'bewaakt nauwlettend de gestelde doelen en planning.'),
(2, 'beargumenteert met steekhoudende argumenten de gemaakte keuzes in het ontwerp die past bij de praktijkrichting (zoals bijv. efficiëntie, structuur, design patterns, toegankelijkheid).'),
(2, 'controleert of het ontwerp voldoet aan de gestelde eisen en wensen en doet indien nodig voorstellen om het ontwerp aan te passen.'),
(2, 'volgt de geldende protocollen en regelgeving rondom privacy, toegankelijkheid, ethiek en veiligheid van de software nauwgezet op en laat dit in het ontwerp zien.'),
(3, 'kiest de juiste materialen en middelen en gebruikt deze effectief.'),
(3, 'hanteert de code conventies volgens de voorgeschreven wijze.'),
(3, 'realiseert software die netjes en goed leesbaar is.'),
(3, 'realiseert de software nauwgezet conform de eisen uit opdracht en ontwerp.'),
(3, 'presteert onder (tijds)druk en/of in een stressvolle omgeving effectief en productief.'),
(3, 'werkt in het geval van integratie van assets samen met andere betrokkenen en stemt met hen een heldere taakverdeling af.'),
(3, 'beargumenteert met steekhoudende argumenten de gemaakte keuzes in de realisatie.'),
(4, 'voert snel, correct en adequaat de testactiviteiten uit.'),
(4, 'interpreteert de testresultaten en trekt logische conclusies.'),
(4, 'legt testresultaten en conclusies nauwkeurig, duidelijk en conform bedrijfs- of beroepsstandaarden vast.'),
(4, 'houdt rekening met de behoeften van de eindgebruikers tijdens het testen.'),
(5, 'analyseert systematisch alle beschikbare informatiebronnen voor de aan te passen software.'),
(5, 'toont technisch inzicht en abstractievermogen bij het interpreteren en vertalen van wensen, reacties, testresultaten...'),
(5, 'stemt met opdrachtgever/leidinggevende/belanghebbenden duidelijk af welke werkzaamheden benodigd zijn, evenals een haalbare planning.'),
(6, 'brengt actief noodzakelijke en relevante onderwerpen voor de samenwerkingsvorm in;'),
(6, 'participeert actief en zelfkritisch in het overleg, door het melden van uitdagingen en knelpunten en/of vragen om advies;'),
(6, 'geeft ruimte aan overige participanten, luistert naar hun input en reageert diplomatiek op die input;'),
(6, 'geeft desgevraagd feedback gebruikmakend van de daarin geldende conventies;'),
(6, 'ontvangt feedback en vraagt door bij onduidelijkheden;'),
(6, 'vraagt naar het werk van anderen en wisselt informatie hierover uit;'),
(6, 'gaat op tijd op zoek naar oplossingen in geval van geconstateerde tekorten in kennis of vaardigheden en formuleert afspraken eenduidig;'),
(6, 'houdt zich aan de afspraken /procedures/werkwijze voor de samenwerking.'),
(7, 'legt de opgeleverde functionaliteiten duidelijk uit en weet vragen over het opgeleverde product of de uitgevoerde werkzaamheden adequaat te beantwoorden.'),
(7, 'houdt een goed opgebouwd en met argumenten onderbouwd verhaal en controleert of de boodschap is overgekomen.'),
(7, 'maakt contact met de toehoorders en stemt de stijl van communiceren en eventuele presentatiemiddelen af op de doelgroep.'),
(8, 'stelt zich open voor feedback en vraagt expliciet naar de mening en ideeën van anderen;'),
(8, 'geeft positieve, constructieve feedback over het werk en/of de inbreng van anderen;'),
(8, 'toont zich kritisch op het eigen werk;'),
(8, 'formuleert concreet nieuwe kwaliteitsdoelen voor de eigen ontwikkeling en/of de samenwerking.');
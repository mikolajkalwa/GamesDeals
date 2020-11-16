/* eslint-disable max-len */
import isFree from './isFree';

const cases: Array<[string, boolean]> = [
  // false positives from the past:
  ['[STEAM | UPLAY] Rainbow Six Siege R6 - FREE WEEKEND (Upto 50% OFF)', false],
  ['[Newegg] The Evil Within 2 - PC/physical copy/free shipping $13 w/code EMCPUEW67', false],
  ['[IndieBox] Wasteland 2: Directors Cut - Standard Edition + Free Gift for Redditors ($8.99 / 55% Off)', false],
  ['[Twitch Prime] June\'s Free Games With Prime: The Banner Saga, The Banner Saga 2, STRAFE, Treadnauts, Tumblestone (Requires Twitch Prime)', false],
  ['[STEAM] Weeklong Deals: Car Mechanic Simulator 2015 (90% off), Tennis Elbow 2013 (40% off), 100% Orange Juice (75% off), Condemned: Criminal Origins (75% off), Space Quest Collection (75% off) and more', false],
  ['[Steam] Weekend Deal: Tooth and Tail $8.99 (55% off). FREE WEEKEND. ends june 11', false],
  ['[Chrono.gg] Kingdom Come: Deliverance + Free Treasures of the Past DLC + Free Coin Shop Game ($44.99 / 25% off)', false],
  ['[WinGameStore] Bethesda Sale|Dishonored 2 ($15.48/61%)|DOOM ($10.98/63%)|Fallout 4 ($13.99/53%)|RAGE ($3.39/66%)|Elder Scrolls III: Morrowind GOTY ($7.49/50%)|Elder Scrolls V: Skyrim VR ($33.29/45%)| The Evil Within 2 ($23.99/60%)|Wolfenstein II: The Freedom Chronicles - Season Pass ($13.25/47%)', false],
  ['[GameStop] Buy 2 Get 1 FREE on Pre-owned products sale - live now until 7/3 11pm PST', false],
  ['[Twitch] Pillars of Eternity Definitive Edition (FREE/100% off with Twitch Prime)', false],
  ['[Twitch] Q.U.B.E. 2 (FREE/100% off with Twitch Prime - July 3rd to July 9th)', false],
  ['[Twitch] SNK Bundle (= Twinkle Star Sprites, Metal Slug 3 &amp; The Last Blade) (FREE/100% off with Twitch Prime - July 3rd to August 2nd)', false],
  ['[Twitch] Battle Chef Brigade (FREE/100% off with Twitch Prime)', false],
  ['[Gamesplanet] Purchase Kingdom Come: Deliverance in July and get 2 Free DLC\'s (From the Ashes + Treasures of the Past) £36.99 / 42.49€ / $48.83 | Steam, worldwide activation', false],
  ['[Steam] Weekend Deal: Rocket League® $9.99 (50% off). FREE WEEKEND. ends july 9', false],
  ['[Twitch] Manual Samuel (FREE/100% off with Twitch Prime - July 5th - 11th)', false],
  ['[Twitch] GoNNER (FREE/100% off with Twitch Prime - July 6th - 12th)', false],
  ['[Twitch] Uurnog Uurnlimited (FREE/100% off with Twitch Prime - July 8th - 14th)', false],
  ['[Twitch] Hue (FREE/100% off with Twitch Prime - July 9th - 15th)', false],
  ['[Gamesplanet] Pre-order Warhammer 40,000: Gladius - Relics of War for £28.79 / 34.19€ / $38.00 and get a free upgrade to Deluxe Edition | Steam, worldwide activation', false],
  ['[Twitch] Deponia Doomsday (FREE/100% off with Twitch Prime - July 10th - 16th)', false],
  ['[Twitch] Observer (FREE/100% off with Twitch Prime - July 11th - 17th)', false],
  ['[Twitch] Tacoma (Free/100% off with Twitch Prime - July 12th - 18th)', false],
  ['[Twitch] The Bridge (Free/100% off with Twitch Prime - July 13th - 19th)', false],
  ['[Twitch] Brutal Legend (Free/100% off with Twitch Prime - July 14th - July 27th)', false],
  ['[Twitch] The Red Strings Club (Free/100% off with Twitch Prime - July 15th - July 21th)', false],
  ['[Twitch] Tyranny (Free/100% off with Twitch Prime - July 16th - 18th)', false],
  ['[Twitch] Deadmau5 box of PUBG (Free/100% off with Twitch Prime)', false],
  ['[Twitch] Broken Age (Free/100% off with Twitch Prime - July 17th - 31st)', false],
  ['[Twitch] "Serial Cleaner" &amp; "The Framed Collection" (Free/100% off with Twitch Prime - July 18th - 31st)', false],
  ['[Steam] Amplitude Studios Free Weekend (Endless Space 2 - 66% Off / Endless Legend - 75% Off / Dungeon of the Endless - 75% Off)', false],
  ['[Steam] Daily Deal: Disgaea PC / 魔界戦記ディスガイア PC $5.24 (65% off). FREE WEEKEND', false],
  ['[IndieBox] Wasteland 2: Director\'s Cut- Physical Collector\'s Edition + FREE Gift for Redditors ($19.99 / 60% Off)', false],
  ['[Humble Store] Hollow Knight ($9.89 / 34% off) Includes DRM-Free copy', false],
  ['[PSN] Destiny 2 - Free with PS+ North America', false],
  ['[Twitch] The Adventure Pals, Pumped BMX, Strife: Veteran Edition, Guild of Dungeoneering, Death Squared (Free / 100% off with Twitch Prime)', false],
  ['[Steam] Middle-earth: Shadow of War (40% off) FREE WEEKEND', false],
  ['Destiny 2 Free @ Best Buy with a Purchase of a Game Priced $29.99+', false],
  ['[Chrono.gg] A Tribute to TotalBiscuit: Redout: Enhanced Edition ($8 / 77% off), XCOM® 2 ($17 / 72% off), Spec Ops: The Line ($6 / 80% off), Dying Light ($11.99 / 70% off), Sid Meier’s Civilization® VI ($28 / 53% off), + More - 7-Day Duration, 100% of Chrono\'s proceeds to charity', false],
  ['[Microsoft.com] Sunset Overdrive - Xbox One Physical Edition ($2.99 plus Free S&amp;H)', false],
  ['[Steam] Special Promotion: A Hat in Time ($17.99/16,79€/£13.79 | 40% off) ends 17 September, Seal the Deal dlc Free for 24 hrs', false],
  ['[Fanatical] Slayer Bundle – Last bundle of Bundle Blast (Tier 1 (4 games - $1.00, £0.89, €1.06) including Styx: Master of Shadow, Tier 2 (8 games - $4.99, £4.55, €5.19) including Day of Infamy &amp; The Sexy Brutale, Tier 3 (5 games - $6.99, £6.39, €7.19) including Medieval Kingdom Wars + FREE Game)', false],
  ['[Twitch Prime] October games: Darksiders Warmastered Edition, Sanitarium, SOMA, System Shock Enhanced Edition. (Free/100% off with Twitch Prime - October 1 to 31)', false],
  ['[Twitch Prime] October games: Darksiders Warmastered Edition, Sanitarium, SOMA, System Shock Enhanced Edition. (Free/100% off with Twitch Prime - October 1 to 31)', false],
  ['[IndieBox] Wasteland 2: Director\'s Cut- Physical Collector\'s Edition + FREE Gift for Redditors ($19.99 / 60% Off)', false],
  ['[PSN - NA Region] inFAMOUS™ Festival of Blood FREE with PS Plus (FREE/100% off)', false],
  ['[The Good Guys - eBay Australia] Nintendo SNES Classic $95.96 AUD - NES Classic $79.96 AUD - Free Click &amp; Collect or an extra $5-$8 posted. Use code PGOOD20 (20% off)', false],
  ['[GreenManGaming] Toybox Turbos (Free/100% off voucher Code) (VIP Deal) Located at bottom of VIP page.', false],
  ['[GreenManGaming] Fahrenheit: Indigo Prophecy Remastered (Free/100% off voucher Code) (VIP Deal) Located at bottom of VIP page.', false],
  // ['[Steam] Worms Franchise Sale (up to 81% off) - Worms W.M.D. Temporally Free to Play', false],
  // ['[TwitchCon] Free copy of Code Vein when you donate blood at TwitchCon (FREE/100% OFF)', false],
  // ['SOULCALIBUR VI &amp; TEKKEN 7 - FREE TO MILTARY.',false], // Missleading title, nothing I can do about
  ['[Fanatical] Australia Bushfire Fundraiser (100% of proceeds from sales go to the WWF. Flash Deals Include – DOOM (-75%), Everspace Ultimate Edition (-85%), Brothers: A Tale of Two Sons (-85%), Skullgirls Complete Bundle (-95%), RiME (-97%)', false],
  ['[Twitch] Mad Tracks (Free/100% off with Amazon Prime membership until July 17th)', false],
  // tricky ones
  ['[Steam] NaissanceE is now Free to Play (previous price tag $14.99/12,99€/£9.99)', true],
  ['Humble Bundle Neverwinter Pack (Free/Normally $20 US)', true],
  ['[Steam] Islands of Nyne: Battle Royale is now FREE TO PLAY (was $24.99)', true],
  // ['[GameSessions] Operation Flashpoint: Dragon Rising Giveaway - FREE via GameSessions client (Steam Key $5.00 / 50% off)', true], // Missleading title
  ['[GOG.com] Unreal Gold ($0/100 off), free for 48 hours', true],
  ['[Steam] Unreal Gold Edition Free ($0/100 off) for a Limited Time', true],
  ['[Steam] Raiders of the Broken Planet Free ($0/100 off) (Until 05-25-2018)', true],
  ['[Steam] THE GREAT GEOMETRIC MULTIVERSE TOUR (Free / 100 off):', true],
  ['[Epic Games] Grand Theft Auto V (Free/100 off)', true],
  ['[Epic Games] Civilization VI (Free/100 off)', true],
  ['[Epic Games] Double space test (Free/100  off)', true],
  // To make sure the function is case insensitive >.>
  ['[GOG] Warhammer 40,000: Rites of War (Free/100% Off)', true],

  ['[itch.io] Big Fish (Free / -100%)', true],
  ['[itch.io] Rumble in the Midwest (Free / -100%)', true],
  ['[GOG] BUTCHER (FREE / –100%)', true], //  gg, '–' !== '-'
];

test.each(cases)('"%s" expect to be %s', (title, expectedResult) => {
  expect(isFree(title)).toBe(expectedResult);
});

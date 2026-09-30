# NCDMV "Sample Test Questions" — retrieval attempt (2026-09-27)

## Official source (ncdot.gov): NOT RETRIEVABLE
- Current URL: https://www.ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Pages/test.aspx
  (page title "Driver License Sample Test Questions", last-modified stamp 7/10/2018).
- `curl -sL` with browser UA returns HTTP 200 but the body contains only the heading and
  "JavaScript must be enabled to use some features of this site. Please do one of the following: Reload Page / View Site Map / Email NCDOT"
  — the questions are injected client-side (SharePoint web part). No embedded JSON, no ASP.NET
  VIEWSTATE payload of question text (`__VIEWSTATE` exists but contains no question strings).
- Archive.org: captures of this exact URL exist (CDX 20190225065511 … 20250108232327, HTTP 200) but every
  snapshot checked (20190225065511, 20210226071740, 20250108232327) serves the same JS-required stub.
  The pre-2019 address `ncdot.gov/dmv/help/Pages/test.aspx` is 404 both live and in the archive.
- JS-capable browser retry failed in this environment (browser tool unusable: "Invalid URL '/tabs'").
- No official ncdot.gov PDF version of the sample questions found via search.

## Actual question text (third-party mirror — verbatim, OCR as-is)
Source: https://carolinaroaddriving.com/wp-content/uploads/2016/02/Sample-Test.pdf
("Carolina Road Driving School Sample Test Questions" — a scan/OCR of the official NCDMV sample test:
90 numbered questions, then "Answer Sheet" listing answers 1-90.)
Fetched 2026-09-27 via web_extract; full extracted text saved at
~/.hermes/cache/web/carolinaroaddriving.com-25c92b8460.md
OCR artifacts present in the original ("0" = D, "8" = B, "8}" = B)).

Note: this PDF is the apparent source of the yuki4266/nc-dmv-chinese question bank (its Q1, Q2, Q7, Q8,
Q9, Q21-23 match the repo's Chinese translations item-for-item).

---

Carolina Road Driving School Sample Test Questions 1.
A driver's license is required for which of the following?
1.
Sitting in the driver's seat of a car while the engine is running.
2.
Steering a car while it is being pushed or towed by another car.
A) 1 Only C) both 1 and 2 B) 2 Only 0) neither 1 nor 2 2.
If a law enforcement officer swears that a driver has refused a legal chemical test, the Division of Motor Vehicles must A) place the driver on probation B) wait for a court decision before taking action C) assign the driver to the Driver Improvement Clinic D) revoke the driver's license for at least 12 months 3.
Which of the following happen(s) under the point system?
1. A driver is sent a warning letter when he gets 4 points within 3 years 2.
A driver who gets 12 points within 3 years may lose his license A) 1 only C) both 1 and 2 B)2 only· 0) neither 1 nor 2 4.
When a driver has a total of 7 points, which of the following may happen?
1.
The driver can be required' to file proof of financial responsibility.
2.
The driver can have 3 points deducted if he satisfactorily completes a Driver Improvement Clinic.
A) 1 only B)2 only C) both 1 and 2 0) neither 1 nor 2 5.
Conviction for which of the following carries the highest number of points?
A) reckless driving B) hit and run with property damage C) driving without a license O} passing a stopped school bus unloading children 6.
A driver will lose his license if he is convicted of A) driving without a license B) passing a stopped school bus C) failing to yield the right of way 0) speeding more than 70 mph in a 55 mph zone 7.
To get a revoked driver's license restored, a person must do which of the following?
1.
Obtain permission from the Driver License Section in Raleigh to reapply for a license.
2.
Goto a driver license office, pay a restoration fee, and reapply for a license.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 8.
Roughly half of all traffic fatalities involve which of the following?
1.
A drunken person.
2.
More than one car.
A) 1 only 8)2 only C) both 1 and 2 D) neither 1 nor 2 9.
The percentage of highway deaths caused by drunken person is A) almost 10 % C) almost 50 % B) almost 25 % 0) almost 67 % 10. Which ofthe following statements about pedestrian deaths is (are) correct?
1.
In cities, 2 out of 5 people killed in motor vehicle accident are pedestrians.
2.
Most of the pedestrians killed in all traffic accidents are teenagers.
A) 1 only C) both 1 and 2 B) 2 only 0) neither 1 nor 2 11. When you are walking at night along a road without sidewalks, you should do which of the following?
1.
Wear or carry something white.
2.
Keep your back to oncoming traffic.
A) 1 only C) both 1 and 2 B) 2 only 0) neither 1 nor 2 12. Recreational vehicles A) need more room to turn corners.
B) need less room to turn corners.
C) should never go around corners.
0) back up easier than cars.
13. If you are walking along a road at night, what should you do?
1.
Walk on the right-hand side with the traffic.
2.
Wear or carry something white.
A) 1 only C) both 1 and 2 B) 2 only 0) neither 1 nor 14. A safe driver does which of the following?
A) watches the side of the road over the hood to stay in lane B) frequently checks the rear view and side mirrors C) drinks coffee while driving at night to stay alert 0) keeps 2 car lengths between his car and the next car on the expressway 15. As you approach an intersection to make a right turn, you should turn on your car's right turn signal and do which of the following?
1.
Steer slightly toward the center of the road to give yourself room to clear the corner.
2.
Hold your arms straight out the window.
A) 1 only C) both 1 and 2 B) 2 only 0) neither 1 nor 2 16. If you begin to feel sleepy while driving on a long trip, you should do which of the following?
1.
Open a window or vent to let fresh air in.
2.
Increase your speed.
A) 1 only B) 2 only C) both 1 and 2 0) neither 1 nor 2 17. When driving on a long trip, you should A) rest your eyes from time to time by rubbing them B) avoid looking at anyone thing for more than a few seconds C) keep your eyes on the center of the road straight ahead D) spend as much time looking in your mirrors as you do looking in front of you 18. In order to avoid being hit in the rear by another vehicle, you should do which of the following?
1.
Drive cautiously and use your break often.
2.
Check your rear view mirrors often.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 19. Studies have shown which of the following to be serious traffic hazard?
1.
Middle-aged drivers 2.
Slow drivers A) 1 only B) 2 only C) both 1 and 2 D) neither 1 nor 2 20. Very slow driving is especially dangerous in which of the following situations?
1.
Just after passing a crest of a hill.
2.
Just after rounding a curve.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 21. Which of the following statements concerning speed limits on the open road in North Carolina is (are) correct?
1.
Unless otherwise posted, the speed limit for passenger cars and pickup trucks is 65 mph.
2.
The speed limit for a school activity bus is 35 mph.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 22. Which of the following statements about speed limits for cars in North Carolina is (are) correct?
1.
The speed limit outside a city is 55 mph unless otherwise posted.
2.
The speed limit inside a city is 25 mph unless otherwise posted.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 23. Which of the following statements about speed limits in North Carolina is (are) correct?
1.
Unless otherwise posted, the speed limit inside a city is 35 mph.
2.
Unless otherwise posted, the speed limit for a school activity bus is 25 mph.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 24. If the alternator warning light stays on as you drive, the problem may be due to A) low engine oil level C) poor ignition condition B) a loose or broken fan belt D) a defective engine diagnosis computer 25. When rounding a curve, a car tends to A) speed up B) move to the inside of the curve C) stay in the center of the lane D) move to the outside of the curve 26. When rounding a sharp curve, you should do which of the following?
1.
Stay as far to the left of your lane as possible.
2.
Apply your break in the sharpest part of the curve.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 27. The driver of a car going down a hill should A) use a lower gear when coming down the hill B) pump his brake when he reaches the curve C) apply the brake firmly and steadily going down the hill D) speed up slightly on the curve to maintain control of the car 28. To reduce speed while going down a steep hill, you should do which of the following?
1.
Use a lower gear.
2.
Drive in a zigzag pattern.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 29. Which of the following is one of the most important facts known about the effect of alcohol on driving ability?
A) After a period of time. Drivers develop immunity to the effects of alcohol.
B) Most people drive slower after a drink or two.
C) Any amount of alcohol lowers a user's ability without the person realizing it.
D) It takes several drinks to make noticeable effects on a driver's ability.
30. If you wish to pass the car ahead on a two-lane road, you should do which of the following?
1.
Blow your horn to signal your intention to the driver of the cars ahead.
2.
Give a left turn signal to let the driver behind you know your intention.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 31. Drivers who take medicine should A) not drive unless someone is with them.
B) drive only during the daytime.
C) learn about the possible side effects before deciding to drive.
D) not drive under any circumstances.
32. Carbon monoxide is present in A) upholstery materials.
B) motor oil.
C) gasoline.
D) an engine's exhaust gases.
33. To be a safe driver in any environment, you need to A) use your horn frequently to warn others to clear the roadway ahead.
B) make sure you avoid changing lanes.
C) seldom use more than one mirror to check traffic.
D) establish and maintain an ample space cushion between your vehicle and possible hazards.
34. Passing on the right is legal on which of the following?
1.
A four-lane highway with 2 lanes going in each direction.
2.
On a one-way street.
A) 1 only B) 2 only C) both 1 and 2 D) neither 1 nor 2 35. It is illegal to pass on a two-lane, two-way street A) over a broken yellow line.
B) over a broken white line.
C) over a double yellow center line.
D) over a double white center line.
36. You are driving in heavy traffic and up ahead you see another car pulling out of a parallel parking space. You should: A) speed up to pass the car pulling out.
B) move a little into the left lane to get out of the way.
C) Slow down and be prepared to stop.
D) Blow your horn and keep going.
37. What should you do to avoid hydroplaning?
A) let out some air of the tires B) apply hard brake pressure C) accelerate D) reduce speed 38. The important type of car insurance to buy is A) uninsured motorist insurance.
B) comprehensive insurance.
C) no-fault insurance.
D) liability insurance.
39. Highway accidents occur most frequently A) on hills B) on curves C) at intersections D) at bridges 40. The major factor in young drivers' poor driving records is A) slower reaction times.
B) inability to pay for insurance.
C) lack of driving experience.
D) poor roadway conditions.
41. When checking tires prior to a long distance trip, remember to A) Check the spare tire air pressure.
B) Wash and dry all tires.
C) Check the balance of all tires.
D) Increase tire air pressure a bit.
42. Some common examples of signs with orange backgrounds are A) DO NOT ENTER, NO PARKING, ONE WAY B) BUMP, PAVEMENT ENDS, SOFT SHOULDER C) NO RIGHT TURN, PASS WITH CARE, SPEED LIMIT D) DETOUR 1000 FEET, ROAD CONSTRUCTION AHEAD, ROAD CLOSED 500 FEET 43. If you come to an unmarked intersection where it is hard to see in all directions because of trees or buildings, you should A) drive at the posted speed limit B) stop near the center of the intersection and continue if it is safe C) slow down and blow your horn to warn drivers who cannot see you D) stop at the intersection and move forward slowly 44. When driving on a city street, you should watch out for which of the following?
1.
Traffic coming from side streets.
2.
Animals or small children darting from between parked cars.
A) 1 only C) both 1 and 2 8) 2 only 0) neither 1 nor 2 45. When driving in heavy traffic, you should do which of the following?
1.
Watch out for drivers who make quick stops.
2.
Yield to pedestrians only at marked crosswalks.
A) 1 only C) both 1 and 2 8) 2 only 0) neither 1 nor 2 46. If you are in the wrong lane for making a left turn at an intersection, you should A) go to the next intersection and turn there 8) back up and move into the correct lane for turning C) wait until all other cars have cleared the intersection and turn 0) signal the driver in the car beside you that you intend to turn in front of him 47. The most frequent type of accident on interstate highway is A) sideswipe collision 8) running off the road C) rear-end collision 0) head-on collision 48. When taking a long trip on an interstate highway, you should plan on doing which of the following 1.
Stopping every 100 miles at a rest area.
2.
Scheduling some hours of night driving to avoid heavy traffic.
A) 1 only C) both 1 and 2 8) 2 only 0) neither 1 nor 2 49. You are driving on an interstate highway when a breakdown forces you to the shoulder.
You should A) sit in the car until help arrives 8) tie a handkerchief to the left handle and stand beside the left front fender C) raise the hood and tie a white handkerchief to the left door handle 0) raise the hood and stand behind the car so drivers of on-coming cars can see you 50. Studies have shown that under normal conditions the chances of a car being involved in an accident on an interstate highway is greater if the driver A) maintains a steady speed 8) travels considerably below the posted speed limit C) travels at the posted speed limit 0) maintains his position relative to cars in front and behind him in his lane 51. If you miss your exit on an interstate highway, you can do which of the following?
1.
Make a u turn.
2.
Go on to the next exit.
A) 1 only 8) ,2only C) both 1 and 2 D) neither 1 nor 2 52. A driver may be temporarily blinded at night by which of the following?
1.
Glare from the headlights of other cars.
2.
Flame from a match he strikes to light a cigarette.
A) 1 only C) both 1 and 2 8) 2 only D) neither 1 nor 2 53. In which of the following situations should you use your low beams?
1.
At night in the city.
2.
In foggy or misty weather.
A) 1 only C) both 1 and 2 8) 2 only D) neither 1 nor 2 54. If the driver of an approaching car fails to dim his headlights, you should do which of the following?
1.
Watch the road ahead to avoid looking at the lights of the other car.
2.
Flick your headlight beams up and down one time.
A) 1 only C) both 1 and 2 8) 2 only D) neither 1 nor 2 55. When driving on a highway at night, you should never use your high-beam headlights if you are A) slowing down for a turn 8) traveling on a road with no median C) going down a hill D) following another car 56. If it starts to drizzle while you are driving, you should do which of the following?
1.
Slow down because the rain wi" loosen oil and gravel on the road.
2.
Allow at least twice the normal following distance.
A) 1 only C) both 1 and 2 8) 2 only D) neither 1 nor 2 57. Roads are likely to be especially slick A) just after the have been paved 8) just after it has begun to rain or drizzle C) after it has been raining for several hours D) in exceptionally cold, dry weather 58. When driving through heavy fog, you should A) turn on your bright lights 8) slow down C) follow the car in front of you closely D) turn on your parking lights 59. When driving in a heavy snowstorm during the day, you should use A) parking lights 8) low-beam headlights C) four-way flashers D) high-beam headlights 60. The best way to get good traction on hard packed snow is to A) put chains on your tires B) use snow tires C) have lower than usual air pressure in your tires D) carry heavy weights in your trunk 61. When trying to pull away from a slippery surface in a car with a manual shift, you should do which of the following?
1.
Start in second or high gear.
2.
Accelerate rapidly.
A) 1 only B) 2 only C) both 1 and 2 D) neither 1 nor 2 62. When pulling a trailer down a long, steep hill, you should do which of the following?
1.
Drive in a lower gear.
2.
Keep in the right lane.
A) 1 only B) 2 only C) both 1 and 2 D) neither 1 nor 2 63. If your breaks fail, you should do which of the following?
1.
Shift into a lower gear.
2.
Use the emergency break.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 64. Wet brakes can be dried out by doing which of the following?
1.
Turn on the heater.
2.
Shifting into a lower gear and keeping light pressure on the break pedal A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 65. If you have a blowout while traveling at a high speed, you should do which of the following?
1.
Apply the break firmly as soon as you notice the blowout.
2.
Grip the steering wheel firmly to keep the car from swerving.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 66. When changing a flat tire, you should do which of the following?
1.
Put the vehicle in neutral gear.
2.
Block the wheels.
A) 1 only B) 2 only C) both 1 and 2 D) neither 1 nor 2 67. If your car breaks down on the highway at night, what should you do?
1.
Park the car completely off the road.
2.
Turn of the high-beam lights.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 68. If your car breaks down on the highway at night, you should do which of the following?
1.
Raise the hood and tie a white handkerchief to the left door handle.
2.
Switch on the parking lights.
A) 1 only C) both 1 and 2 B) 2 only D) neither 1 nor 2 69. If your vehicle has run off the road onto the shoulder, you should A) shift quickly to a lower gear 6) brake with heavy constant pressure C) apply the emergency brake D) take your foot off the gas pedal gradually 70. Skids are likely to occur on which of the following roads?
1.
One on which snow has become packed.
2.
One that has just been paved.
A) 1 only C) both 1 and 2 6) 2 only D) neither 1 nor 2 71. If you have to come to a stop on an icy road, you should A) use your hand break 6) put the brake on hard C) apply the brake in short hard jabs D) pump the brake pedal lightly 72. What should you do when you begin to skid?
1.
Turn the steering wheel in the direction in which the rear end of the car is skidding.
2.
Reduce pressure on the gas pedal.
A) 1 only C) both 1 and 2 6) 2 only D) neither 1 nor 2 73. A driver who is involved in an accident should do which of the following?
1.
Make an immediate report to the nearest law enforcement agency.
2.
Notify his insurance company.
A) 1 only C) both 1 and 2 6) 2 only D) neither 1 nor 2 74. A flashing red traffic signal at an intersection means which of the following?
1.
Slow down and proceed with caution.
2.
Stop only if it is necessary to yield the right-of-way.
A) 1 only C) both 1 and 2 6) 2 only D) neither 1 nor 2 75. A flashing yellow traffic signal at an intersection means A) no right turn 8) yield the right-of-way C) no left turn D) slow down and proceed with caution 76. A diamond-shaped sign would be used to warn drivers of which of the following driving hazards?
1.
A railroad crossing.
2.
A deer crossing.
A) 1 only 6) 2 only C) both 1 and 2 D) neither 1 nor 2 77. A diamond-shaped traffic sign means A) no left turn 8) come to a full stop C) yield the right-of-way D) slow down and drive with care 78. When can you disregard a signal given by a police officer directing traffic?
1.
An emergency vehicle is approaching.
2.
The officer's signal is in conflict with a traffic signal.
A) 1 only C) both 1 and 2 8) 2 only D) neither 1 nor 2 79. What is the main color for signs in highway work zone?
A} red 8} white C} orange D} green 80. When does the law give a blind pedestrian special consideration at intersections where there are no traffic lights?
1.
Only when he is alone.
2.
If he holds a white cane or has a guide dog with him.
A) 1 only C} both 1 and 2 8} 2 only D} neither 1 nor 2 81. Which of the following statements about bicycle riders is (are) correct?
1.
They must ride their bicycles facing traffic.
2.
They are likely to be seriously injured in almost any collision with a car.
A) 1 only C} both 1 and 2 8) 2 only D} neither 1 nor 2 82. In North Carolina, which of the following are required on all cars?
A) license plate lights 8} courtesy lights C) fender lights D} backup lights 83. Your brakes need checking if A} there is a strong smell of gasoline in the car 8} the engine stalls at stoplights C) light gusts of wind make the car difficult to control D} there is a squeaking noise when you step on the brake 84. Which of the following statements about horns and sirens is (are) correct?
1.
Every licensed motor vehicle must have a horn.
2.
Only law enforcement and emergency vehicle may have sirens.
A) 1 only C) both 1 and 2 8} 2 only D} neither 1 nor 2 85. Every motor vehicle must be equipped with A) a muffler 8} 4-ply tires C) Mudguards D) Shoulder harnesses 86. The system that carries harmful fumes from the engine to the rear of the car and releases them is called the A) ignition system B) fuel system C) suspension system D) exhaust system 87. A leaky exhaust system should be repaired because it A) wastes gas and oil B) causes the engine to run hot C) may allow dangerous fumes to enter the car D) makes the engine hard to start and likely to stall 88. A car that pitches and tosses in normal driving and leans heavily to the side on turns is likely to have trouble in which of the following systems?
A) ignition B) steering C) brake D) suspension 89. Which traffic is required to stop if a school bus makes a passenger stop in the far right lane on a five lane street?
A) All lanes of traffic.
B) Lanes going in the same direction as the school bus.
C) Lanes going the opposite direction of bus.
D) Turning lane only 90. Maximum speed limit for a full sized public school bus in North Carolina is: A) 55 MPH C) 35 MPH B) 45 MPH D) 25 MPH Answer Sheet 1.C 2.0 3.B 4.B 5.0 6.B 7.C 8.A 9.C 10.A 11.A 12.A 13.B 14.0 15.0 16.A 17.B 18.B 19.B 20.C 21.0 22.A 23.A 24.8 25.0 26.0 27.A 28.A 29.C 30.C 31.C 32.0 33.0 34.A 35.C 36.C 37.0 38.0 39.C 40.C 41.A 42.0 43.0 44.C 45.A 46.A 47.C 48.A 49.C 50.B 51.B 52.C 53.C 54.C 55.0 56.C 57.B 58.8 59.8 60.A 61.A 62.C 63.C 64.B 65.8 66.8 67.A 68.C 69.0 70.A 71.0 72.C 73.C 74.0 75.0 76.8 77.0 78.0 79.C 80.B 81.8 82.A 83.0 84.C 85.A 86.0 87.C 88.0 89.B 90.8
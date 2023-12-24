# Code Samples

## What?
This is where I'm going to put some code snippits that I am particularly proud of, or that I believe demonstrate my good taste. A lot of the work I do isn't mine to share, but I'll try to get permission for noteworthy examples.

## Why?
Sometimes recruiters like to see examples of code to see where you're at in your skill and quality level. A lot of the things I have public on my github are old, so I wanted a way to show what I'm up to without making all of my work public.
It's also nice to let my friends and students take a peek at what I'm up to.

## Are these code snippits perfect code?
Not likely. My real code is often in a constant state of improvement. I try to get things working then I spend a little time splitting things up into more logical functions, cleaning up the logic, renaming variables, and making sure my comments are both human and machine readable. (JSDoc and python doc strings are good practices that I live by)

## what are the laws or philosophy that govern your code?
1. Don't write code that hurts people.
    - Secure systems and systems that are appropriately reliable are important. An example of an appropriately reliable system might be, a program that people use for fun that fails 1/2000 uses vs one that is used to keep people alive in a hospital environment where we are looking for a failure in 1/100,000,000 uses.  (These numbers are ones I made up, but they are there to demonstrate that how reliable a system is has to do with how critical that system is. More reliable means more expensive to build and maintain, so as a developer we can't just say "all systems must be perfect")
2. Write code for junior level devs
    - It is rarely good to be as clever as possible when writing code. At the end of the day, the best programmers in your org don't have time and the worst ones don't have the skills to appreciate your incredibly dense one liners. I strive to write code that is easy to understand. I will gladly write double the code if it is twice or more readable.
3. Without comments your code isn't complete.
    - As you might see, I write a lot of comments. I tend to not only comment about the code itself, but the reasons each decision was made, possible shortcomings, and notes for future improvements.
4. Write working code before you write perfect code.
    - Most good code is distilled from multiple rewrites. If you can write it perfectly the first time do it, but it will be faster for you to produce multiple iterations of progressively better code if you feel yourself stuck on implimentation.
5. Write code with developer time and use case in mind.
    - Developer time is expensive. If your O(N^2) implimentation takes 30 minutes to write and runs in 4 hours, but your O(N) implimentation take 2 hours to write and runs in 10 minutes then the correct thing to write depends on a few factors. 
        1. is this code meant for production/ many users? If it is then slight performance increases might make differences of tens of thousands of dollars or hours.
        2. do you need the results of this code right away? Sometimes you need an answer right now, sometimes you need it in a week.
    If we write code in 10 minutes that takes 7 hours to finish but don't need it until tomorrow. then we have probably saved money. computer time is cheaper than developer time.
6. Write more functions. Functions keep everything clean and readable. don't be afraid to break thing out. 
7. Try to make your business logic super clear. Ideally your business logic should be close to plain english, ie:
    client = start_new_client()
    config_file = get_config_file()
    client.config(config_file)
    client.run_services()

    This is something anyone can understand.

8. There may be more. I will add them as I think of them and update these as I update my skills.

## Is there a best programming language.
Of course.
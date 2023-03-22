# EasyPantry.app

## Initial Idea

Easy Pantry is a website I designed and built from the ground up to help me track what I had in my kitchen pantry.

## Design decisions

I wanted it to be minimal, simple, and easy to use. I didn't like apps with a lot of adds, and I also didn't want to fuss with things like scanning QR codes or barcodes and dealing with an overabundance of information (both as a user and a dev). In that sense it was an oportunity to learn how to write my own api, rather than use someone else's.

Some major changes have happened across the lifetime of Easy Pantry.

#### Content is entirely user generated
When I started this project I checked what was out there that might be similar, and I found multiple apps that allow you to track things that seemed far more useful for the company who wrote it than the user. If I have eggs, does the app really need to keep track of whether they are Grade A or Grade AA. As a user do I care what brand they are? I think the answer is: Not really. I may care when I buy it, but once I bring it home, all I need to remember is that I have "Eggs." Between the flexible naming and the tagging system, Easy Pantry has chosen an opt-in approach to information. Additional information can be added if users want it, but the app is built to reduce the initial complexity as much as possible.


#### Items are unique to the user
User A adds an Item C to their account, if User B also adds Item C, there are two Item C's in the DB. I did this because the app is so simple. If I abstracted all the user specific data from the item into a separate object (expiration, quantity, etc.) then an "item" would just be a string. If Item had been filled with barcode information and branding, etc, then I would have made the decision to seperate user specific Item data from item specific data. Instead, I trusted the user to write their own items, and if they write "Milk" (whether a gallon or a quart) they know what they mean. Because of this I let multiple similar Items exist across users.

#### Originally designed with "Categories" rather than "tags"
The app was originally designed to match the way I thought about my own pantry, where Items existed on the "top-right-shelf" or "above-the-fridge." The idea being you could search for an item "Do I have Paprika?" and it would return with "yes, it's in "bottom-center-shelf." In practice when I tested that version, people didn't care so much about where something was and instead wanted things like "Do I have snacks?" or "What Spices do I have?" It seems small, but Tags really are a much more intuitive way for a lot of people to find stuff. I may still re-implement something like Categories again in the future, but it would be in conjunction with the tag system.

### Additional Ideas
#### Allowing multiple users to access the same pantry
This is probably the biggest feature I would like to add. Seeing as a User *is* a Pantry, it is better to simply recommend that users share an account at least for now.
#### Recommended tags for items
This one was a suggestion I received from a friend, and while I like the idea at face value, I do think that it goes against the initial premise of the app. While this may be useful for many people, there are people who dislike technology that feels like it's 'watching' them. Something like scanning the database for "milk" and suggesting "dairy" because it's the most common tag, while innocuous, is exactly the kind of thing I was intending to avoid. It also gets in the way of users being able to tailor their own experience. Because of this, I am unlikely to add things like this.

### Tool choices
#### Typescript
I prefer static typing, It helps me immensely in finding bugs before I run it. I also like that I can let a typing issue go and come back and more strictly type later. As a newer person to web dev, I liked the idea of learning a single language and building an entire app, instead of loosely understanding multiple languages.

#### MongoDB
I'd like to say that this was a strong decision, but I honestly just wanted to learn it because I had a little bit of experience in it, and I believed I needed more practice. I think in the end it was the right decision as I like the way Typegoose and TypeGraphQL work together to describe the object without an excess of files. I also find the document model very intuitive. If I wanted to learn other databases, I would likely start by trying to rewrite this app using the new db.

#### GraphQL
GraphQL was chosen primarily because I liked the structure of queries. I liked that they explicitly state what they expect back. Instead of having a rest endpoint and then filtering everything that comes back in the response, I can just explicitly state what I want. This is more a front-end decision, but I like that feature. I also like that ApolloGraphQL keeps track of what changed between queries. When I bagan this project I didn't have a strong idea of what GraphQL could do, but as the project evolved it became a very core part of the application.

#### Docker
Docker didn't become a part of the project plan until much later when I had messed around with some open source projects and they required I download and run docker images. Having learned what docker was, and as I progressed further in the project, I began to realize that while more difficult initially, docker would be extremely useful in managing cleanup and teardown by myself.

#### AWS
Once I had figured out I wanted to use docker, I planned on running it on a personal Kubernetes cluster I had built from Raspberry Pi's. In practice this was a massive pain and I didn't have nearly enough knowledge to tackle it on my first go. This is where AWS stepped in. AWS had a much friendlier introductory experience, and I was able to get everything up and running in half the time I had wasted on K8S. I would still like to get it running on my personal cluster, but I needed the app up and running for job applications and that meant I had to go with the option that "just worked" rather than continue trying to get fancy.

#### Major (and minor) resources:
[JWT Authentication by Ben Awad]( https://www.youtube.com/watch?v=25GS0MLT8JU&t=7512s)

This was by far and away the most thorough and helpful guide I could find on the concept of JWTs and I couldn't have even started this app without it. One of the few that didn't say "You shouldn't do this, but I'm going to do it anyway." Security is important and I didn't know enough to feel comfortable doing it myself.

##### Stack Overflow

##### Various Documentation Pages

##### Github issues

---
If you have any other questions about how or why I did something please feel free to ask. I'd love to talk about it. - Darby
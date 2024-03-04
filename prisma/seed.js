const bcrypt = require("bcrypt");
const { prisma } = require("../prisma");
const { BCRYPT_WORK_FACTOR } = require("../config");
const moment = require('moment');


async function main() {

    let users = [];
    let events = [];
    let matches = [];
    let password = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);

    const admin = await prisma.user.create({
        data: {
            isAdmin: true,
            email: "admin@admin.com",
            firstName: "admin",
            lastName: "user",
            password
        }
    });
    users.push(admin);

    const testUser1 = await prisma.user.create({
        data: {
            isAdmin: false,
            email: "test@user.com",
            firstName: "test",
            lastName: "user",
            password
        }
    });
    users.push(testUser1);

    const testUser2 = await prisma.user.create({
        data: {
            isAdmin: false,
            email: "test2@user.com",
            firstName: "test",
            lastName: "user",
            password
        }
    });
    users.push(testUser2);
    console.log(users);
}
//     let now = moment.utc();
//     const date = now.add(6, "M");

//     const testEvent1 = await prisma.event.create({
//         data: {
//             hostEmail: "test@user.com",
//             title: "Test event test user",
//             geoLocation: [0, 0],
//             city: "New York",
//             state: "New York",
//             dateTime: date,
//             description: "Test event test user description",
//             type: ["dogs", "cafe"],
//             payment: 1000
//         }
//     });
//     events.push(testEvent1);

//     const testEvent2 = await prisma.event.create({
//         data: {
//             hostEmail: "test2@user.com",
//             geoLocation: [0, 0],
//             city: "New York",
//             state: "New York",
//             title: "Test event test user2",
//             dateTime: date,
//             description: "Test event test user 2 description",
//             type: [],
//             payment: null
//         }
//     });
//     events.push(testEvent2);
//     console.log(events);

//     const match1 = await prisma.match.create({
//         data: { eventId: testEvent1.id, guestEmail: "test2@user.com" },
//     });

//     matches.push(match1);

//     const match2 = await prisma.match.create({
//         data: { eventId: testEvent2.id, guestEmail: "test@user.com" },
//     });

//     matches.push(match2);
//     console.log(matches);
// };
main();
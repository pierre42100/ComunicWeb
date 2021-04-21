/**
 * Forez Presence Helper
 * 
 * @author Pierre Hubert
 */

class Presence {
    constructor(userID, year, month, day) {
        this.userID = userID;
        this.year = year;
        this.month = month;
        this.day = day;
    }
}


class ForezPresenceHelper {
    /**
     * Load the list of presence
     * 
     * @param {number} groupID Target group ID
     * @returns {Promise<Presence[]>}
     */
    static async GetList(groupID) {
        const list = await ws("forez_presence/list", {group: groupID});

        return list.map(el => {
            const infos = el.split(",").map(e => Number(e));
            return new Presence(...infos)
        });
    }

    /**
     * Add a day of presence
     * 
     * @param {number} groupID 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     */
    static async AddDay(groupID, year, month, day) {
        await ws("forez_presence/add_day", {
            group: groupID,
            year: year,
            month: month,
            day: day
        })
    }

    /**
     * Remove a day of presence
     * 
     * @param {number} groupID 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     */
    static async DelDay(groupID, year, month, day) {
        await ws("forez_presence/del_day", {
            group: groupID,
            year: year,
            month: month,
            day: day
        })
    }

    static async UpdateEvents(groupID, oldStart, oldEnd, newStart, newEnd) {
        const newDays = new Set(getDaysOfRange(newStart, newEnd).map(el => el.getTime()));
        const oldDays = new Set(getDaysOfRange(oldStart, oldEnd).map(el => el.getTime()));

        for (const el of newDays) {
            if(oldDays.has(el)) {
                newDays.delete(el)
                oldDays.delete(el)
            }
        }

        for(const newEl of newDays) {
            const date = new Date(newEl);
            await this.AddDay(groupID, date.getFullYear(), date.getMonth() + 1, date.getDate())
        }

        for(const oldEl of oldDays) {
            const date = new Date(oldEl);
            await this.DelDay(groupID, date.getFullYear(), date.getMonth() + 1, date.getDate())
        }
    }
}
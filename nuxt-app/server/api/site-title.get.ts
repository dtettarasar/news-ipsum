import { getSiteTitle } from "../database/site-content";

export default defineEventHandler(() => {
    return getSiteTitle()
})
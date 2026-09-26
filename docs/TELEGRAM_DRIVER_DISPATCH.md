# Telegram Driver Dispatch

The driver group is **Rent'n Roll Deliveries**. It is used only for claimable
delivery and return-collection broadcasts; customer names, phones, addresses, booking
references, and rental items are never posted there.

## One-time Telegram setup

1. Create the private group named `Rent'n Roll Deliveries` in Telegram.
2. Add the Rent'n Roll bot to the group and promote it to an administrator with
   permission to invite users and remove members.
3. Send `/chatid` in the group. The bot replies with the negative group chat ID.
4. Set that ID as `TELEGRAM_DELIVERY_GROUP_ID` in Vercel Production and Preview.
5. Confirm the bot webhook is `https://rentandroll.com/api/webhooks/telegram`
   and uses the Production `TELEGRAM_WEBHOOK_SECRET`. Subscribe it to
   `callback_query`, `message`, and `chat_member` updates.

## Driver workflow

1. Each driver opens a private chat with the bot, presses Start, and sends
   `/chatid` to obtain their personal Telegram user ID.
2. An admin adds that ID at `/admin/drivers`, then creates a one-time group invite.
3. The driver joins the group. Telegram sends a `chat_member` webhook and marks
   the driver active for claims. If that webhook was missed, the first claim checks
   the driver's current group membership with Telegram and activates the driver.
4. The daily operations cron posts a request containing only date, delivery window,
   and postcode. An active driver taps **I'll take it**.
5. The webhook atomically assigns the request and sends the full customer and
   address details only to that driver's private bot chat.

Removing a driver from `/admin/drivers` removes them from the Telegram group and
immediately prevents any future claim. Drivers must have started the bot privately
before they can receive assigned-job details.

## Testing

A test delivery request is clearly marked and contains no customer or booking data.
When an eligible driver claims it, the group post is marked as a test claim and the
bot sends only test details privately. It never creates or changes a booking.

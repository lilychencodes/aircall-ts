# Aircall phone calls
Project to Aircall's FE challenge: https://github.com/aircall/frontend-hiring-test

### Demo
**Initial app load:**

![image](https://user-images.githubusercontent.com/9043536/151911241-71a2b901-6495-415a-b2ce-6925be032ae1.png)

**You can group by date and other filters:**
![image](https://user-images.githubusercontent.com/9043536/151911321-301bba5c-1cb4-4960-9a1a-602fe54ffec9.png)

## To run the application

1. Download the repository.
2. cd into the root directory and run `npm i`.
3. Navigate to localhost:3000.

### To run tests

1. From the root directory, run `npm test`.

## Product requirements

#### Basic requirements
- [x] Display a paginated list of calls retrieved from the API.
- [x] Display the call details view if the user clicks on a call. The view should display all the data related to the call itself.
- [x] Be able to archive one or several calls.
- [x] Group calls by date.
- [x] Handle real-time events (Whenever a call is archived or a note is being added to a call, these changes should be reflected on the UI immediately).

NOTE: Handling of real-time events from user generated action is reflected by a state change.

#### Bonus:
- [x] Use Typescript.
- [x] Provide filtering feature. Provided ability to filter by call type and direction.

## Improvements for a real production setting
If this were a real application in production, I'd make a few adjustments.
These are:

1. Use a Redux architecture to handle application state. Dispatch thunks to make api calls, which update the Redux store.
2. Use a more efficient way of updating phone calls for real-time UX changes.
   The brute force solution of looping through the list of calls and make necessary changes is O(N). I'd change my data structure to make the update O(1).
   This most likely means storing a list of phone calls in an object keyed by call id.
3. Use a better design to group calls by date. For this project, a list view is fine because there aren't that many different dates to filter.
4. Incorporate error handling in the UI. I'd add some UI to notify user of any api failures.

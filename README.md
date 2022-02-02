# Aircall phone calls
Project to Aircall's FE challenge: https://github.com/aircall/frontend-hiring-test

### Demo
**Initial app load:**

![image](https://user-images.githubusercontent.com/9043536/151912727-e47e3c34-20ad-4011-bb8b-46aa85b16335.png)

**You can group by date and other filters:**
![image](https://user-images.githubusercontent.com/9043536/151916876-d88d9f88-3bde-43fc-a74b-079ee8bfc24c.png)

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

#### Bonus:
- [x] Use Typescript.
- [x] Provide filtering feature. Provided ability to filter by call type and direction.

## Improvements for a more scalable setting
Some design choices made on this project were based on the project scope and limited time.
If I had more time, and if I were building this application for production where the data volume is large, I'd make a few adjustments.

These are:

1. Use a Redux architecture to handle application state. Dispatch thunks to make api calls, which update the Redux store.
2. Use a more efficient way of updating phone calls for real-time UX changes.
   The brute force solution of looping through the list of calls and make necessary changes is O(N). I'd change my data structure to make the update O(1).
   This most likely means storing a list of phone calls in an object keyed by call id.
3. Use a better design to group calls by date. For this project, a list view is fine because there aren't that many different dates to filter.
   In production, I'd look into a Calendar component to select date.
4. Incorporate error handling in the UI. I'd add some UI to notify user of any api failures.
5. I'd implement a system to fetch the next few pages of calls from the api once user reached the end of the pagination in the client. Since the limit never goes above 200 for this project, I manually set the limit and only fetch once.
6. I'd go back and clean up the code more:
  - [ ] refactor components into different files
  - [ ] add more tests for the components

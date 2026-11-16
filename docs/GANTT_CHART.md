# Gantt Chart and Project Schedule
## College Event Management System

**Status:** Draft – pending team review  
**Proposed schedule:** 13–18 November 2026  
**Target completion:** 18 November 2026  
**Schedule owner:** Person 4 – Narasimha

> This is a proposed compressed schedule based on the current Project Plan and WBS. Confirm the official deadline, team availability, estimates, and dependencies before treating these dates as committed.

## 1. Detailed schedule

| ID | Activity | Owner | Start | Finish | Duration | Dependency |
|---|---|---|---|---|---:|---|
| S01 | Review Project Plan | All; Person 4 coordinates | 13 Nov | 13 Nov | 1 day | Draft plan |
| S02 | Review WBS and confirm task ownership | All; Person 4 coordinates | 13 Nov | 13 Nov | 1 day | Draft WBS |
| S03 | Confirm requirements and acceptance criteria | Person 1 | 13 Nov | 13 Nov | 1 day | Existing requirements |
| S04 | System architecture and UI design | Person 2 | 13 Nov | 14 Nov | 2 days | S03 |
| S05 | Database design and relationships | Person 2 | 13 Nov | 14 Nov | 2 days | S03 |
| S06 | Prepare Gantt chart and risk register | Person 4 | 13 Nov | 14 Nov | 2 days | S02 |
| S07 | Development environment and project setup | Person 3 | 14 Nov | 14 Nov | 1 day | Initial design decisions |
| S08 | Implement event browsing and details | Person 3 | 14 Nov | 15 Nov | 2 days | S04, S07 |
| S09 | Implement registration and duplicate prevention | Person 3 | 15 Nov | 16 Nov | 2 days | S05, S08 |
| S10 | Implement organizer event create/update/cancel | Person 3 | 15 Nov | 16 Nov | 2 days | S04, S05, S07 |
| S11 | Implement participant, schedule, and venue features | Person 3 | 16 Nov | 16 Nov | 1 day | S09, S10 |
| S12 | Implement certificate issue/view/download flow, if confirmed in scope | Person 3 | 16 Nov | 17 Nov | 2 days | S09, S11 |
| S13 | Prepare test cases | Person 1 + Person 3 | 15 Nov | 16 Nov | 2 days | S03 |
| S14 | Feature testing and requirements validation | Person 1 + Person 3 | 17 Nov | 17 Nov | 1 day | S08–S12 |
| S15 | Defect fixes and regression testing | Person 3 | 17 Nov | 17 Nov | 1 day | S14 |
| S16 | Compile final project documentation | Person 4; all contribute | 17 Nov | 18 Nov | 2 days | Design, implementation, test evidence |
| S17 | Prepare demo/presentation | All; Person 4 coordinates | 17 Nov | 18 Nov | 2 days | Working prototype |
| S18 | Final team review and approval | All | 18 Nov | 18 Nov | 1 day | S15–S17 |
| S19 | Final submission and repository archive | Person 4 coordinates | 18 Nov | 18 Nov | 1 day | S18 |
| S20 | Jira progress tracking, blocker follow-up, and risk review | Person 4; all update their tasks | 13 Nov | 18 Nov | Ongoing | Starts with baseline |

Durations are calendar-day estimates, not guaranteed person-days. Tasks may overlap where dependencies permit.

## 2. Gantt chart

```mermaid
gantt
    title College Event Management System – Proposed Schedule
    dateFormat YYYY-MM-DD
    axisFormat %d %b

    section Planning and coordination
    Project Plan review              :s01, 2026-11-13, 1d
    WBS and ownership review         :s02, 2026-11-13, 1d
    Gantt and risk register          :s06, 2026-11-13, 2d
    Jira and risk tracking           :active, s20, 2026-11-13, 6d

    section Requirements and design
    Requirements confirmation        :s03, 2026-11-13, 1d
    Architecture and UI design       :s04, 2026-11-13, 2d
    Database design                  :s05, 2026-11-13, 2d

    section Development
    Environment and project setup    :s07, 2026-11-14, 1d
    Event browsing and details       :s08, 2026-11-14, 2d
    Registration and duplicate check :s09, 2026-11-15, 2d
    Organizer event management       :s10, 2026-11-15, 2d
    Participant, schedule, venue     :s11, 2026-11-16, 1d
    Certificate flow                 :s12, 2026-11-16, 2d

    section Testing and delivery
    Prepare test cases               :s13, 2026-11-15, 2d
    Feature testing and validation   :s14, 2026-11-17, 1d
    Fixes and regression testing     :s15, 2026-11-17, 1d
    Final documentation              :s16, 2026-11-17, 2d
    Demo and presentation            :s17, 2026-11-17, 2d
    Final review and approval        :milestone, s18, 2026-11-18, 0d
    Submission and archive           :milestone, s19, 2026-11-18, 0d
```

## 3. Daily schedule and checkpoints

| Date | Planned work | Expected checkpoint |
|---|---|---|
| **13 Nov (Fri)** | Team reviews Project Plan and WBS; Person 1 confirms requirements; Person 2 starts architecture/UI/database design; Person 4 starts schedule and risk register | Scope, responsibilities, and initial schedule reviewed |
| **14 Nov (Sat)** | Person 2 completes initial design; Person 3 sets up project and begins event browsing; Person 4 completes draft Gantt and risk register | Initial design handover and development setup |
| **15 Nov (Sun)** | Person 3 continues event browsing and starts registration and organizer functions; Person 1 and Person 3 prepare test cases | Core development underway; test cases drafted |
| **16 Nov (Mon)** | Person 3 works on registration, organizer functions, participant management, schedule/venue, and certificate flow as feasible | Main feature implementation targeted |
| **17 Nov (Tue)** | Person 1 and Person 3 test and validate features; Person 3 fixes defects; Person 4 compiles documentation; team prepares demo | Test evidence, fixes, and draft final documentation |
| **18 Nov (Wed)** | Team reviews prototype and documents; finalize presentation; Person 4 coordinates submission and repository archive | Final team approval and submission |

## 4. Milestones

| Milestone | Target date | Completion evidence |
|---|---|---|
| Project Plan and WBS reviewed | 13 Nov 2026 | Team feedback/confirmation recorded |
| Requirements and initial design ready | 14 Nov 2026 | Requirements and design artefacts available |
| Core application features implemented | 16 Nov 2026 | Demonstrable prototype features |
| Testing and defect correction completed | 17 Nov 2026 | Test results and known-issue status recorded |
| Final review and submission | 18 Nov 2026 | Team-approved documents and submitted project |

## 5. Scheduling notes

1. Confirm the official deadline. The 18 November target comes from the current planning context.
2. The schedule includes 14 and 15 November (Saturday and Sunday). Confirm that team members are available; otherwise move the dates and revise the target.
3. Requirements confirmation and design can overlap with project-management work. Development should begin when the relevant design decisions and interfaces are sufficiently clear.
4. Test-case preparation can overlap with development once requirements are stable.
5. If time becomes insufficient, prioritize event browsing, event details, registration with duplicate prevention, and organizer event management. Treat optional administrator functionality and certificate automation according to the team's confirmed scope.
6. Update Jira with actual progress, blockers, and revised forecasts. Mark work complete only when its agreed output is available and reviewed.

## 6. Suggested Jira mapping

| Jira task | Schedule ID | WBS reference |
|---|---|---|
| Review Project Plan | S01 | 1.4 |
| Review WBS and confirm ownership | S02 | 1.5 |
| Confirm requirements | S03 | 2.6 |
| Architecture/UI/database design | S04–S05 | 3.0 |
| Prepare Gantt and risk register | S06 | 1.5–1.6 |
| Development tasks | S07–S12 | 4.0 |
| Test cases and testing | S13–S15 | 5.0 |
| Final documentation and presentation | S16–S17 | 7.0 |
| Final review and submission | S18–S19 | 7.5–7.6 |
| Progress and risk tracking | S20 | 6.0 |

Create or update Jira issues under the appropriate parent epics. Include the schedule ID and WBS ID in each issue description, and set assignee, due date, and dependency links where supported.

## 7. Review and approval

| Reviewer | Review focus | Status |
|---|---|---|
| Person 1 – Amrutesh | Requirements dates and testing involvement | Pending |
| Person 2 – Design & Database | Design estimates and handover dates | Pending |
| Person 3 – Asritha | Development and testing estimates | Pending |
| Person 4 – Narasimha | Dependencies, coordination, and schedule tracking | Pending |

**Approval note:** This schedule is a draft. Update it after the team confirms availability, estimates, dependencies, and the official completion date.

**Suggested repository path:** `docs/project-management/GANTT_CHART.md`

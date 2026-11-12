# Work Breakdown Structure (WBS)
## College Event Management System

---

## 1. Purpose

This Work Breakdown Structure (WBS) decomposes the College Event Management System into manageable phases, work packages, and tasks. It identifies the expected work, primary owner, and key dependencies so the team can estimate effort, track progress in Jira, and prepare the project schedule.

The WBS is based on the current Requirements & Analysis document. It should be updated if the team approves changes to the project scope or responsibilities.

## 2. Team responsibilities

| Team member | Primary responsibility |
|---|---|
| Person 1 – | Requirements analysis and validation |
| Person 2 – | UI/UX design, system design, database design |
| Person 3 – | Development and testing |
| Person 4 – | Project planning, coordination, Jira tracking, and documentation |

> These are primary areas of responsibility. Team members may support one another where needed. Confirm the exact name of Person 2 and any task-level assignments with the team.

## 3. WBS hierarchy

| WBS ID | Phase / work package | Included work | Primary owner | Dependency |
|---|---|---|---|---|
| 1.0 | Project initiation and planning | Establish project baseline and coordination approach | Person 4 | None |
| 1.1 | Confirm project objectives and scope | Review objectives, in-scope and out-of-scope features | Person 1; Person 4 | None |
| 1.2 | Identify stakeholders and team roles | Confirm student, organizer, optional administrator, and team responsibilities | Person 1; Person 4 | 1.1 |
| 1.3 | Prepare project plan | Document objectives, scope, deliverables, milestones, assumptions, and constraints | Person 4 | 1.1–1.2 |
| 1.4 | Review and baseline project plan | Collect team feedback and record agreed changes | All; coordinated by Person 4 | 1.3 |
| 1.5 | Prepare WBS and schedule | Break work into tasks, estimate durations, identify dependencies | Person 4 with team input | 1.4 |
| 1.6 | Prepare risk management plan | Identify risks, assess likelihood/impact, define responses and owners | Person 4 with team input | 1.5 |
| 1.7 | Set up project tracking | Create/confirm Jira issues, owners, due dates, statuses, and repository links | Person 4 | 1.3 |
| 2.0 | Requirements analysis and validation | Define and validate the system requirements | Person 1 | 1.0 |
| 2.1 | Define project scope and boundaries | Confirm features included and excluded | Person 1 | 1.1 |
| 2.2 | Identify stakeholders and user roles | Define student/participant, event organizer/coordinator, optional administrator | Person 1 | 2.1 |
| 2.3 | Document functional requirements | Document event listing/details, registration, duplicate prevention, event management, participant management, schedules/venues, certificates | Person 1 | 2.2 |
| 2.4 | Document non-functional requirements | Document usability, security, performance, reliability, browser compatibility, maintainability | Person 1 | 2.2 |
| 2.5 | Prepare use cases and user stories | Describe key user interactions and acceptance criteria | Person 1 | 2.3–2.4 |
| 2.6 | Review and hand over requirements | Validate requirements and share the approved baseline with design/development | Person 1; reviewed by team | 2.3–2.5 |
| 3.0 | System, UI, and database design | Translate requirements into design artefacts | Person 2 | 2.6 |
| 3.1 | Define system architecture | Identify major components and their interactions | Person 2 | 2.6 |
| 3.2 | Design user interface and navigation | Prepare screens and navigation for students and organizers; include admin only if retained | Person 2 | 3.1 |
| 3.3 | Design database structure | Identify entities, attributes, relationships, and constraints | Person 2 | 2.3; 3.1 |
| 3.4 | Define data validation and access rules | Specify required fields, duplicate-registration prevention, and role-based access expectations | Person 2 with Person 1 input | 2.3–2.4; 3.3 |
| 3.5 | Review and hand over design | Confirm design is consistent with requirements and share implementation guidance | Person 2; reviewed by Person 3 | 3.1–3.4 |
| 4.0 | Application development | Implement the agreed system features | Person 3 | 3.5 |
| 4.1 | Set up development environment and project structure | Configure application, dependencies, and repository structure | Person 3 | 3.5 |
| 4.2 | Implement authentication and user access | Implement login/access control if included in the agreed prototype | Person 3 | 4.1; 3.4 |
| 4.3 | Implement event browsing | Build event listing and event detail views | Person 3 | 4.1; 3.2 |
| 4.4 | Implement event registration | Build registration flow, open-registration checks, and duplicate-registration prevention | Person 3 | 4.2–4.3; 3.3 |
| 4.5 | Implement event management | Allow organizers to create, update, and cancel events | Person 3 | 4.2–4.3 |
| 4.6 | Implement participant management | Allow organizers to view/manage event participants | Person 3 | 4.4–4.5 |
| 4.7 | Implement schedules and venue information | Display event schedule and venue details | Person 3 | 4.3; 3.3 |
| 4.8 | Implement certificate features | Allow eligible certificates to be issued and students to view/download them | Person 3 | 4.4; 4.6; eligibility rules confirmed |
| 4.9 | Integrate application components | Connect UI, application logic, and database | Person 3 | 4.2–4.8 |
| 5.0 | Testing and quality assurance | Verify the system against requirements and correct defects | Person 3; Person 1 supports requirement checks | 4.9 |
| 5.1 | Prepare test cases | Derive test cases from functional requirements and acceptance criteria | Person 3 with Person 1 | 2.3–2.5 |
| 5.2 | Test event browsing and details | Verify event list and detail information | Person 3 | 4.3 |
| 5.3 | Test registration rules | Verify registration flow, closed-event handling, and duplicate prevention | Person 3 | 4.4 |
| 5.4 | Test organizer functions | Verify create, update, cancel, and participant-management functions | Person 3 | 4.5–4.6 |
| 5.5 | Test schedule, venue, and certificates | Verify schedule/venue display and certificate issue/view/download flows | Person 3 | 4.7–4.8 |
| 5.6 | Test usability, security, and compatibility | Perform practical checks against the agreed non-functional requirements | Person 3 | 4.9 |
| 5.7 | Fix defects and perform regression testing | Correct identified issues and retest affected functionality | Person 3 | 5.2–5.6 |
| 5.8 | Validate against requirements | Confirm implemented features satisfy the agreed requirements | Person 1 and Person 3 | 5.7 |
| 6.0 | Project monitoring and control | Track work, decisions, changes, and risks throughout the project | Person 4 | Starts at 1.0; ongoing |
| 6.1 | Maintain Jira task board | Update task owners, statuses, due dates, and links | Person 4; all members update own tasks | 1.7 |
| 6.2 | Monitor progress and blockers | Review task progress and follow up on blocked/overdue work | Person 4 with all members | 6.1 |
| 6.3 | Review and update risks | Reassess risks and record mitigation actions | Person 4 with risk owners | 1.6 |
| 6.4 | Record meetings and decisions | Maintain concise meeting notes, decisions, and action items | Person 4 | Ongoing |
| 6.5 | Manage scope and schedule changes | Record proposed changes and assess impact before updating the baseline | Person 4 with team | 1.4 |
| 7.0 | Final documentation and handover | Assemble and review final project materials | Person 4; all members contribute | 5.8 |
| 7.1 | Collect team deliverables | Gather requirements, design, database, development, and testing artefacts | Person 4 | 2.6; 3.5; 5.8 |
| 7.2 | Prepare final project documentation | Compile consistent project overview, requirements, design, implementation, and testing sections | Person 4 with all members | 7.1 |
| 7.3 | Review documentation quality | Check completeness, consistency, terminology, formatting, and evidence | All; coordinated by Person 4 | 7.2 |
| 7.4 | Prepare demonstration/presentation | Organize demo flow, presentation materials, and speaking responsibilities | All; coordinated by Person 4 | 5.8; 7.2 |
| 7.5 | Final team review and approval | Obtain team confirmation of final deliverables | All | 7.3–7.4 |
| 7.6 | Submit and archive project artefacts | Place final approved files in the agreed repository/location and complete submission | Person 4 coordinates; team supports | 7.5 |

## 4. Major deliverables

| Deliverable | WBS reference | Responsible owner |
|---|---|---|
| Requirements & Analysis document | 2.0 | Person 1 |
| System architecture and UI design | 3.1–3.2 | Person 2 |
| Database design | 3.3 | Person 2 |
| Working application prototype | 4.0 | Person 3 |
| Test cases and test results | 5.0 | Person 3, with Person 1 support |
| Project Plan | 1.3 | Person 4 |
| WBS and Gantt chart | 1.5 | Person 4 |
| Risk Management Plan / Risk Register | 1.6 | Person 4 |
| Jira tracking and meeting records | 6.0 | Person 4 |
| Final compiled documentation and presentation | 7.0 | Person 4 coordinates; all contribute |

## 5. Proposed sequencing and dependencies

The following sequence is a planning guide, not a claim that every task must finish before any parallel work can begin.

1. Confirm the scope and requirements baseline.
2. Prepare and review the Project Plan; then finalize the WBS.
3. Start architecture, UI, and database design using the validated requirements.
4. Begin development when the relevant design decisions and interfaces are sufficiently clear. Some implementation tasks may proceed in parallel.
5. Prepare test cases while development is underway; test features as they become available.
6. Fix defects, validate the implementation against requirements, and complete final documentation and presentation.
7. Monitor Jira tasks, schedule, and risks continuously across all phases.

## 6. Planning assumptions and boundaries

- The WBS reflects the current agreed feature scope: event browsing, registration, organizer event management, participant management, schedule/venue information, and certificate issue/view/download.
- Payment processing, QR attendance, AI recommendations, dedicated mobile applications, and external SMS are excluded unless the team formally changes the scope.
- Administrator functionality is optional and should only be planned as a committed feature if the team confirms it.
- Certificate eligibility is confirmed by the organizer; automated attendance verification is not included.
- The technology stack and detailed implementation approach are to be confirmed by the design and development members.
- Durations and dates must be estimated with the team and entered into the Gantt chart/Jira. Do not treat this WBS alone as a fixed schedule.
- A task owner is accountable for coordinating that task; other members may contribute.

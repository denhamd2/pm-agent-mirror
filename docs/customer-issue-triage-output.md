<table>
  <thead>
    <tr>
      <th>Jira # &amp; Title</th>
      <th>Short description of issue</th>
      <th>Status</th>
      <th>Salomon Guidance</th>
      <th>Deployment Agent Guidance</th>
      <th>XO Metadata Analysis / Proposed Fix</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://jira2.workday.com/browse/HRREC-82310">HRREC-82310</a> - Endorse Candidate Notification to Primary Recruiter does not trigger 2</td>
      <td>When a candidate applies and selects "I know someone", the "Endorse Candidate" business process triggers. However, the notification configured on this process fails to send to the "Primary Recruiter", although it works for other roles like HR Admin.</td>
      <td><strong>Bug (85%)</strong></td>
      <td><strong>Likely Bug</strong><br/>Jira HRREC-82310 describes this exact symptom as a known, reopened defect, and internal Slack threads confirm the custom notification fails to trigger for the Primary Recruiter upon completion of the Endorse Candidate event. It is not a Configuration Issue because the customer's setup is correct but the system evaluates security against the wrong context (worker instead of job application).<br/>Sources: <a href="https://slack.com/archives/C0FLMUB3N/p1756418454527699">Custom Notification Not Triggering for Primary Recruiter on Endorse Candidate Event Completion</a>, <a href="https://slack.com/archives/C0FLMUB3N/p1617648774092200">How to Resolve Custom Notification Routing Issues in Endorse Candidate Business Process</a></td>
      <td><strong>Expected Behaviour</strong><br/><ul><li>The "Send Endorsement Request" step initiates the "Endorse Candidate" business process.</li><li>The identified employee receives an inbox item to endorse the candidate.</li><li>The employee can approve or deny the endorsement and add comments.</li><li>A notification configured on the Endorse Candidate BP should route correctly to the Primary Recruiter associated with the Job Application.</li></ul>Sources: <a href="https://doc.workday.com">Deployment Agent Knowledge Base</a></td>
      <td><strong>Metadata findings:</strong> Confirms defect on method binding <code>Contextually Secured@get Secured by Role Enabled(SS)*O</code> (Instance ID 19$2891). The method evaluates security on the context of the Event (the worker) rather than the Job Application.<br/><strong>Proposed Fix:</strong> Update the method binding or related CRF (e.g., <code>af15cc4d1cb410001d99589de5b500dd</code>) to evaluate security using the Job Application context so the Primary Recruiter role resolves correctly. Verify by triggering the Endorse Candidate BP and confirming the notification reaches the Primary Recruiter.</td>
    </tr>
  </tbody>
</table>
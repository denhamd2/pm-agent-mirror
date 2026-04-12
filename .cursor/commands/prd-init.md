# PRD to JIRA - Configuration Initialization

## Description

Initialize and configure PRD to JIRA settings for your project. This command will guide you through setting up:
- JIRA project key
- Components
- Default assignee
- Team field settings
- Default labels
- Epic structure preferences

## Instructions

1. **Check for Existing Configuration**
   - Look for `.prd-to-jira/config.json` in the current workspace
   - If it exists, read it and show current settings
   - If it doesn't exist, create it with defaults

2. **Gather Configuration from User**
   - Ask the user for each setting one by one:
     - **JIRA Project Key**: (default: "CMTYAEM")
     - **Components**: Array of component names (default: ["Integration"])
     - **Default Assignee**: JIRA username (default: "akash.majumder")
     - **Team Field ID**: Custom field ID for team (default: "customfield_13400")
     - **Team ID**: The team ID value (default: "3320")
     - **Team Name**: Display name for the team (default: "CMTY Globetrotters")
     - **Default Labels**: Array of default labels (default: ["cmty-auth-gemini"])

3. **Save Configuration**
   - Create `.prd-to-jira/config.json` with the provided settings
   - Format as JSON with proper structure:
     ```json
     {
       "jira": {
         "projectKey": "[user input]",
         "components": ["[user input]"],
         "defaultAssignee": "[user input]",
         "teamField": {
           "fieldId": "[user input]",
           "teamId": "[user input]",
           "teamName": "[user input]"
         },
         "defaultLabels": ["[user input]"]
       },
       "epic": {
         "structure": {
           "sections": [
             "Description",
             "Goals & Business Outcomes",
             "Scope",
             "Out of Scope",
             "Child User Stories",
             "Acceptance Criteria",
             "Dependencies & Risks",
             "Target Timeline"
           ]
         }
       }
     }
     ```
   - Ensure the directory exists before writing

4. **Confirm Configuration**
   - Display the saved configuration in a readable format
   - Confirm that all commands will now use these settings
   - Note that users can run this command again to update settings

## Configuration File Location

The configuration file is saved at: `.prd-to-jira/config.json`

This file is:
- ✅ Included in `.gitignore` (user-specific settings)
- ✅ Used by all PRD to JIRA commands
- ✅ Can be updated anytime by running this command again

**Note:** This is an **agent skill** - an npm package that provides IDE commands and workflows for AI-powered IDEs. It works with JIRA integration tools (MCP servers) configured in your IDE, but this package itself is not an MCP server.

## Usage

Simply run: `/prd-init` (Cursor) or `*prd-init` (Claude Code/Windsurf)

The command will guide you through each setting with helpful defaults.

## Notes

- All other commands (`/prd-to-epics` or `*prd-to-epics`, `/prd-to-jira-stories` or `*prd-to-jira-stories`, etc.) will automatically read from this config file
- You can update settings anytime by running this command again
- The config file is workspace-specific, so different projects can have different settings


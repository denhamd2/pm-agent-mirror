# AWS CLI Setup via SSO (Browser Login)

## The Situation

You're logged into AWS via the web console, but the Redshift MCP needs AWS CLI credentials. Since you don't have Homebrew and the AWS CLI installer needs sudo, the easiest path is **AWS SSO** - which uses browser login (like how you just logged in).

## Option 1: Install AWS CLI (Requires Admin Password)

If you can use sudo, run:

```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "/tmp/AWSCLIV2.pkg"
sudo installer -pkg /tmp/AWSCLIV2.pkg -target /
```

Then skip to Step 2 below.

## Option 2: Use Python pip (No Admin Required)

```bash
pip3 install awscli --user
```

Then add to your PATH:
```bash
echo 'export PATH="$HOME/Library/Python/3.9/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Step 2: Configure AWS SSO

Once AWS CLI is installed, configure SSO:

```bash
aws configure sso
```

You'll be prompted for:

1. **SSO session name**: `workday` (or any name you want)
2. **SSO start URL**: This is your Workday AWS SSO URL
   - Look in your AWS Console for "SSO start URL" 
   - Or ask your team: "What's the AWS SSO start URL for Workday?"
3. **SSO Region**: `eu-north-1` (since you're in Stockholm region)
4. **SSO registration scopes**: Press Enter (use default)

This will open your browser to authenticate (like you just did).

5. **CLI default client Region**: `us-west-2` (where the Redshift data is)
6. **CLI default output format**: `json`
7. **CLI profile name**: `okta2aws` (to match our Redshift MCP config)

## Step 3: Test It Works

```bash
AWS_PROFILE=okta2aws aws sts get-caller-identity
```

You should see your AWS account ID and user info.

## Step 4: Update Redshift MCP Config

Update `~/.cursor/mcp.json` to use SSO instead of okta2aws:

```json
{
  "mcpServers": {
    "redshift-mcp-server": {
      "command": "/Users/david.denham/mcp-servers/redshift-mcp-server/run_mcp_server_uv.sh",
      "args": [
        "okta2aws",
        "us-west-2"
      ],
      "env": {
        "FASTMCP_LOG_LEVEL": "INFO"
      }
    }
  }
}
```

The profile name `okta2aws` will work with AWS SSO credentials.

## Step 5: Restart Cursor

1. Quit Cursor completely (Cmd+Q)
2. Reopen Cursor
3. The Redshift MCP should connect

## Step 6: Test Redshift Access

In Cursor chat:
```
List available Redshift clusters
```

---

## Quick Alternative: Ask Your Team

Since this is getting complex, the fastest path might be:

**Message in Slack:**
```
I'm logged into AWS Console but need AWS CLI configured for Redshift access. 

What's the AWS SSO start URL for Workday? And which Redshift cluster has the Tableau presales data?

Context: Trying to query row-level opportunity data since Tableau VizQL is disabled.
```

Your team likely has the SSO URL and can tell you the exact cluster name, which will save you discovery time.

---

**Current Status**: You have AWS Console access (web), but need AWS CLI credentials for the Redshift MCP to work.

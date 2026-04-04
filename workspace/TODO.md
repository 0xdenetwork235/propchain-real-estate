<instructions>
This file powers chat suggestion chips. Keep it focused and actionable.

# Be proactive
- Suggest ideas and things the user might want to add *soon*. 
- Important things the user might be overlooking (SEO, more features, bug fixes). 
- Look specifically for bugs and edge cases the user might be missing (e.g., what if no user has logged in).

# Rules
- Each task must be wrapped in a "<todo id="todo-id">" and "</todo>" tag pair.
- Inside each <todo> block:
  - First line: title (required)
  - Second line: description (optional)
- The id must be a short stable identifier for the task and must not change when you rewrite the title or description.
- You should proactively review this file after each response, even if the user did not explicitly ask, maintain it if there were meaningful changes (new requirement, task completion, reprioritization, or stale task cleanup).
- Think BIG: suggest ambitious features, UX improvements, technical enhancements, and creative possibilities.
- Balance quick wins with transformative ideas — include both incremental improvements and bold new features.
- Aim for 3-5 high-impact tasks that would genuinely excite the user.
- Tasks should be specific enough to act on, but visionary enough to inspire.
- Remove or rewrite stale tasks when completed, obsolete, or clearly lower-priority than current work.
- Re-rank by impact and user value, not just urgency.
- Draw inspiration from the project's existing features — what would make them 10x better?
- Don't be afraid to suggest features the user hasn't explicitly mentioned.
</instructions>

<todo id="auth-otp-real">
Wire real OTP delivery (email/SMS)
Currently the demo code is always 123456 — integrate a real OTP service (Resend, Twilio, etc.) to email the code on submit
</todo>

<todo id="wallet-connect">
Connect real wallet (wagmi/viem)
Replace mock wallet state in AppContext with wagmi hooks for real MetaMask/WalletConnect signing
</todo>

<todo id="portfolio-sdk-items">
Create PortfolioItem records on invest
After successful transaction in PropertyDetail, also create a PortfolioItem via useMutation so Portfolio page shows holdings
</todo>

<todo id="property-detail-enhance">
Enhance PropertyDetail page
Add token purchase flow, real-time price chart, and transaction history per property
</todo>

<todo id="portfolio-charts">
Add portfolio analytics charts
Visualize allocation, yield history, and ROI using recharts or similar
</todo>

<todo id="mobile-polish">
Mobile UX polish
Ensure all pages look great on small screens; check spacing, overflow, and tap targets
</todo>

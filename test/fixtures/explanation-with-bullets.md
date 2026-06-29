# Scheduler architecture

This explanation describes the scheduler architecture and the rationale behind its queue model.

The scheduler favors predictable throughput over immediate execution because jobs often share resource limits.

Important concepts:

- queues group jobs by priority;
- workers lease jobs for bounded intervals;
- retries preserve failure context;
- back pressure protects dependent services.

Compared with a direct execution model, this design makes trade-offs around latency and observability.

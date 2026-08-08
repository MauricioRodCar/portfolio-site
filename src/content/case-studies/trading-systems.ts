// Real personal cAlgo (cTrader) code, trimmed to the illustrative core —
// same rule as the other case studies: curated snippets, not full files.
// No client/NDA concern here, these are Mauricio's own tools.

export const SCALPER_SNIPPET = {
  lang: "csharp",
  filename: "JumpScalperMicrostructure.cs",
  code: `
protected override void OnTick()
{
    if (Server.Time - lastTradeTime < TimeSpan.FromSeconds(CooldownSeconds))
        return;

    double delta = Symbol.Bid - lastBid;
    double spread = Symbol.Ask - Symbol.Bid;
    double jump = Math.Abs(delta);
    double minJump = JumpSize * Symbol.PipSize;

    // A jump alone isn't enough — wait one more tick to see whether it
    // keeps accelerating (real momentum, skip it) or gets absorbed
    // (likely to snap back — the actual opportunity).
    if (!waitingConfirmation && jump >= minJump && spread < jump)
    {
        waitingConfirmation = true;
        pendingDirection = delta;
        pendingJump = jump;
        pendingSpread = spread;
        return;
    }

    if (waitingConfirmation)
    {
        bool accelerating = IsAccelerating(pendingDirection);
        bool absorbing = IsAbsorbing(pendingDirection);
        bool validSpeed = IsSpeedValid();

        if (accelerating || !absorbing || !validSpeed)
        {
            waitingConfirmation = false;
            return;
        }

        // Net edge after cost: bet on reversion back toward the
        // pre-jump price, sized to the jump itself.
        double effectiveJump = pendingJump - pendingSpread;
        double tpPips = (effectiveJump * TpFactor) / Symbol.PipSize;
        double slPips = (effectiveJump * SlFactor) / Symbol.PipSize;

        var tradeType = pendingDirection > 0 ? TradeType.Sell : TradeType.Buy;
        ExecuteMarketOrder(tradeType, SymbolName, Volume, "JumpScalper", slPips, tpPips);
        waitingConfirmation = false;
    }
}

private bool IsAccelerating(double direction)
{
    var last = tickDeltas.Reverse().Take(3).ToArray();
    return last.All(d => Math.Sign(d) == Math.Sign(direction)) &&
           Math.Abs(last[0]) < Math.Abs(last[1]) &&
           Math.Abs(last[1]) < Math.Abs(last[2]);
}

private bool IsAbsorbing(double direction)
{
    var last = tickDeltas.Reverse().Take(3).ToArray();
    return last.Any(d => Math.Sign(d) != Math.Sign(direction)) ||
           Math.Abs(last[2]) < Math.Abs(last[0]);
}
`.trim(),
};

export const RSI_SNIPPET = {
  lang: "csharp",
  filename: "RsiReversalEngine.cs",
  code: `
public static class RsiReversalEngine
{
    // Confirmed reversal: RSI was in an extreme zone and closes back
    // inside the 30-70 range — the cross back IN, not just "RSI > 70".
    public static ReversalSignal DetectSignal(
        IndicatorDataSeries rsi, int index, double overbought, double oversold)
    {
        double prev = rsi[index - 1];
        double curr = rsi[index];

        if (prev >= overbought && curr < overbought)
            return ReversalSignal.BearishReversal;

        if (prev <= oversold && curr > oversold)
            return ReversalSignal.BullishReversal;

        return ReversalSignal.None;
    }
}

public static class SrZoneEngine
{
    // 5-bar fractal high/low. Tolerance is passed in price (ATR * a
    // multiplier) so "nearby" adapts to the current volatility regime
    // instead of a fixed pip distance.
    public static bool HasNearbyZone(
        Bars bars, int index, int lookbackBars, double tolerance,
        bool findResistance, double referencePrice, out double nearestLevel)
    {
        nearestLevel = double.NaN;
        double bestDistance = double.MaxValue;

        for (int i = index - lookbackBars; i <= index - 2; i++)
        {
            bool isFractal = findResistance
                ? bars.HighPrices[i] > bars.HighPrices[i - 1] && bars.HighPrices[i] > bars.HighPrices[i - 2] &&
                  bars.HighPrices[i] > bars.HighPrices[i + 1] && bars.HighPrices[i] > bars.HighPrices[i + 2]
                : bars.LowPrices[i] < bars.LowPrices[i - 1] && bars.LowPrices[i] < bars.LowPrices[i - 2] &&
                  bars.LowPrices[i] < bars.LowPrices[i + 1] && bars.LowPrices[i] < bars.LowPrices[i + 2];

            if (!isFractal) continue;

            double level = findResistance ? bars.HighPrices[i] : bars.LowPrices[i];
            double distance = Math.Abs(referencePrice - level);
            if (distance < bestDistance)
            {
                bestDistance = distance;
                nearestLevel = level;
            }
        }

        return bestDistance <= tolerance;
    }
}
`.trim(),
};

export const tradingSystems = {
  slug: "trading-systems",
  tags: ["C#", "cAlgo", "Algorithmic Trading", "Market Microstructure"],
};

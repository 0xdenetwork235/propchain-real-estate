import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  TrendUp,
  Coins,
  Lightning,
  Buildings,
  FileText,
  ArrowSquareOut,
  CheckCircle,
  Minus,
  Plus,
  SignIn,
} from "@phosphor-icons/react";
import { useMutation } from "@animaapp/playground-react-sdk";
import { mockProperties } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wallet, setWalletModalOpen, addToast, isAnonymous } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const [tokenAmount, setTokenAmount] = useState(1);
  const [investing, setInvesting] = useState(false);
  const [invested, setInvested] = useState(false);

  const { create: createTransaction } = useMutation("Transaction");

  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <main className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-h2 font-sans text-foreground mb-4">Property Not Found</h2>
          <button
            onClick={() => navigate("/marketplace")}
            className="text-cyan font-body cursor-pointer hover:underline"
          >
            Back to Marketplace
          </button>
        </div>
      </main>
    );
  }

  const fundedPercent = Math.round(
    ((property.totalTokens - property.availableTokens) / property.totalTokens) * 100,
  );
  const totalCost = tokenAmount * property.tokenPrice;
  const estimatedYield = (totalCost * property.rentYield) / 100;

  const handleInvest = async () => {
    // Require email login first
    if (isAnonymous) {
      navigate("/auth");
      return;
    }
    // Require wallet
    if (!wallet.connected) {
      setWalletModalOpen(true);
      return;
    }
    setInvesting(true);
    try {
      await createTransaction({
        type: "buy",
        propertyId: property.id,
        propertyName: property.name,
        amount: totalCost,
        tokens: tokenAmount,
        timestamp: new Date(),
        status: "confirmed",
        txHash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`,
        gasUsed: 21000,
        confirmations: 1,
        network: property.network,
      });
      setInvested(true);
      addToast({
        type: "success",
        title: "Investment Successful!",
        description: `You purchased ${tokenAmount} token${tokenAmount > 1 ? "s" : ""} of ${property.name}`,
      });
    } catch (err) {
      addToast({ type: "error", title: "Transaction Failed", description: "Please try again." });
    } finally {
      setInvesting(false);
    }
  };

  return (
    <main className="min-h-screen pt-[72px] pb-20 md:pb-8">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={property.image}
          alt={property.imageAlt}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[rgba(0,0,0,0.5)] text-foreground hover:bg-[rgba(0,0,0,0.7)] transition-colors cursor-pointer text-body-sm font-body"
            aria-label="Go back"
          >
            <ArrowLeft size={16} weight="duotone" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <span className={`text-caption font-body px-2.5 py-1 rounded-full ${
                  property.status === "active"
                    ? "bg-success text-success-foreground"
                    : property.status === "funded"
                    ? "bg-muted text-muted-foreground"
                    : "bg-warning text-warning-foreground"
                }`}>
                  {property.status === "coming_soon" ? "Coming Soon" : property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
                <span className="text-caption font-mono text-foreground bg-muted px-2.5 py-1 rounded-full">{property.network}</span>
                <span className="text-caption font-body text-muted-foreground bg-muted px-2.5 py-1 rounded-full capitalize">{property.propertyType}</span>
              </div>

              <h1 className="text-h1 font-sans text-foreground mb-2">{property.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={16} weight="duotone" className="text-muted-foreground" />
                <span className="text-body font-body text-muted-foreground">{property.location}</span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Annual ROI", value: `${property.roiAnnual}%`, color: "text-success", icon: TrendUp },
                  { label: "Rent Yield", value: `${property.rentYield}%`, color: "text-cyan", icon: Lightning },
                  { label: "Appreciation", value: `${property.appreciationRate}%`, color: "text-accent", icon: TrendUp },
                  { label: "Token Price", value: `$${property.tokenPrice}`, color: "text-foreground", icon: Coins },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="bg-card border border-border-subtle rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} weight="duotone" className={color} />
                      <span className="text-caption font-body text-muted-foreground">{label}</span>
                    </div>
                    <p className={`text-h4 font-mono ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-card border border-border-subtle mb-6">
                  <TabsTrigger value="overview" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Overview</TabsTrigger>
                  <TabsTrigger value="tokenomics" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Tokenomics</TabsTrigger>
                  <TabsTrigger value="documents" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Documents</TabsTrigger>
                  <TabsTrigger value="history" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="bg-card border border-border-subtle rounded-lg p-6">
                    <h3 className="text-h3 font-sans text-foreground mb-3">About This Property</h3>
                    <p className="text-body font-body text-neutral-300 leading-relaxed mb-6">{property.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-caption font-body text-muted-foreground mb-1">Total Property Value</p>
                        <p className="text-body font-mono text-foreground">${property.totalValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-caption font-body text-muted-foreground mb-1">Min. Investment</p>
                        <p className="text-body font-mono text-foreground">${property.minInvestment}</p>
                      </div>
                      <div>
                        <p className="text-caption font-body text-muted-foreground mb-1">Property Type</p>
                        <p className="text-body font-body text-foreground capitalize">{property.propertyType}</p>
                      </div>
                      <div>
                        <p className="text-caption font-body text-muted-foreground mb-1">Blockchain Network</p>
                        <p className="text-body font-body text-foreground">{property.network}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tokenomics">
                  <div className="bg-card border border-border-subtle rounded-lg p-6">
                    <h3 className="text-h3 font-sans text-foreground mb-4">Token Distribution</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-body-sm font-body text-muted-foreground">Tokens Sold</span>
                          <span className="text-body-sm font-mono text-foreground">
                            {(property.totalTokens - property.availableTokens).toLocaleString()} / {property.totalTokens.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={fundedPercent} className="h-2 bg-muted" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-caption font-body text-muted-foreground mb-1">Total Supply</p>
                          <p className="text-body font-mono text-foreground">{property.totalTokens.toLocaleString()}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-caption font-body text-muted-foreground mb-1">Available</p>
                          <p className="text-body font-mono text-cyan">{property.availableTokens.toLocaleString()}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-caption font-body text-muted-foreground mb-1">Token Price</p>
                          <p className="text-body font-mono text-foreground">${property.tokenPrice}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-caption font-body text-muted-foreground mb-1">Market Cap</p>
                          <p className="text-body font-mono text-foreground">${(property.totalTokens * property.tokenPrice).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="bg-card border border-border-subtle rounded-lg p-6">
                    <h3 className="text-h3 font-sans text-foreground mb-4">Legal Documents</h3>
                    <div className="space-y-3">
                      {["Property Deed", "Investment Prospectus", "Smart Contract Audit", "Valuation Report"].map((doc) => (
                        <div key={doc} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText size={20} weight="duotone" className="text-cyan" />
                            <div>
                              <p className="text-body-sm font-body text-foreground">{doc}</p>
                              <p className="text-caption font-body text-muted-foreground">Verified on blockchain</p>
                            </div>
                          </div>
                          <button className="flex items-center gap-1.5 text-body-sm font-body text-cyan hover:text-foreground transition-colors cursor-pointer">
                            View
                            <ArrowSquareOut size={14} weight="duotone" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="bg-card border border-border-subtle rounded-lg p-6">
                    <h3 className="text-h3 font-sans text-foreground mb-4">Ownership History</h3>
                    <div className="space-y-4">
                      {[
                        { date: "2024-01-15", event: "Token Sale Launched", detail: "Initial offering at $250/token" },
                        { date: "2024-02-20", event: "50% Funded", detail: "5,000 tokens sold" },
                        { date: "2024-04-10", event: "First Yield Distribution", detail: "$18,000 distributed to holders" },
                        { date: "2024-07-01", event: "Q2 Yield Distribution", detail: "$22,500 distributed to holders" },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-cyan mt-1.5 shrink-0" />
                            {i < 3 && <div className="w-px flex-1 bg-border-subtle mt-1" />}
                          </div>
                          <div className="pb-4">
                            <p className="text-caption font-mono text-muted-foreground">{item.date}</p>
                            <p className="text-body-sm font-body text-foreground">{item.event}</p>
                            <p className="text-caption font-body text-muted-foreground">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Investment Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="sticky top-24"
            >
              <div className="bg-card border border-border-subtle rounded-lg p-6">
                <h3 className="text-h3 font-sans text-foreground mb-4">Invest Now</h3>

                {/* Funding Progress */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-body-sm font-body text-muted-foreground">Funding Progress</span>
                    <span className="text-body-sm font-mono text-foreground">{fundedPercent}%</span>
                  </div>
                  <Progress value={fundedPercent} className="h-2 bg-muted" />
                  <p className="text-caption font-body text-muted-foreground mt-1.5">
                    {property.availableTokens.toLocaleString()} tokens remaining
                  </p>
                </div>

                {/* Token Amount */}
                <div className="mb-6">
                  <label className="text-body-sm font-body text-muted-foreground block mb-2">Number of Tokens</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTokenAmount(Math.max(1, tokenAmount - 1))}
                      className="w-10 h-10 rounded-md bg-muted text-foreground hover:bg-secondary transition-colors cursor-pointer flex items-center justify-center"
                      aria-label="Decrease token amount"
                    >
                      <Minus size={16} weight="duotone" />
                    </button>
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 h-10 text-center bg-muted border border-border-subtle rounded-md text-body font-mono text-foreground focus:outline-none focus:border-cyan"
                      min={1}
                      max={property.availableTokens}
                      aria-label="Token amount"
                    />
                    <button
                      onClick={() => setTokenAmount(Math.min(property.availableTokens, tokenAmount + 1))}
                      className="w-10 h-10 rounded-md bg-muted text-foreground hover:bg-secondary transition-colors cursor-pointer flex items-center justify-center"
                      aria-label="Increase token amount"
                    >
                      <Plus size={16} weight="duotone" />
                    </button>
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-muted rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-body-sm font-body text-muted-foreground">Token Price</span>
                    <span className="text-body-sm font-mono text-foreground">${property.tokenPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-sm font-body text-muted-foreground">Quantity</span>
                    <span className="text-body-sm font-mono text-foreground">{tokenAmount}</span>
                  </div>
                  <div className="border-t border-border-subtle pt-2 flex justify-between">
                    <span className="text-body-sm font-body text-foreground font-medium">Total Cost</span>
                    <span className="text-body font-mono text-cyan">${totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-sm font-body text-muted-foreground">Est. Annual Yield</span>
                    <span className="text-body-sm font-mono text-success">+${estimatedYield.toFixed(2)}</span>
                  </div>
                </div>

                {/* Contract Address */}
                <div className="mb-6">
                  <p className="text-caption font-body text-muted-foreground mb-1">Smart Contract</p>
                  <div className="flex items-center gap-2">
                    <p className="text-caption font-mono text-cyan truncate flex-1">{property.contractAddress}</p>
                    <a
                      href={`https://etherscan.io/address/${property.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-cyan transition-colors cursor-pointer"
                      aria-label="View on blockchain explorer"
                    >
                      <ArrowSquareOut size={16} weight="duotone" />
                    </a>
                  </div>
                </div>

                {/* CTA */}
                {property.status === "active" ? (
                  <button
                    onClick={handleInvest}
                    disabled={investing || invested}
                    className={`w-full h-12 rounded-md font-body font-normal text-body transition-all duration-200 cursor-pointer flex items-center justify-center gap-2
                      ${invested
                        ? "bg-success text-success-foreground"
                        : "bg-gradient-primary text-primary-foreground hover:brightness-110"
                      } disabled:opacity-70 disabled:cursor-not-allowed`}
                    aria-label={invested ? "Investment confirmed" : "Invest now"}
                  >
                    {investing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : invested ? (
                      <>
                        <CheckCircle size={18} weight="duotone" />
                        Investment Confirmed!
                      </>
                    ) : isAnonymous ? (
                      <>
                        <SignIn size={18} weight="duotone" />
                        Sign In to Invest
                      </>
                    ) : !wallet.connected ? (
                      <>
                        <Coins size={18} weight="duotone" />
                        Connect Wallet to Invest
                      </>
                    ) : (
                      <>
                        <Coins size={18} weight="duotone" />
                        Invest Now
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full h-12 rounded-md bg-muted text-muted-foreground font-body font-normal text-body cursor-not-allowed"
                  >
                    {property.status === "funded" ? "Fully Funded" : "Coming Soon"}
                  </button>
                )}

                {/* Auth hint */}
                {isAnonymous && property.status === "active" && (
                  <p className="text-caption font-body text-muted-foreground text-center mt-3">
                    Free account required to invest
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

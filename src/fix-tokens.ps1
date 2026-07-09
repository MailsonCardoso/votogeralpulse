$files = @(
  "src\components\layout\AppNavbar.tsx"
  "src\components\layout\AppSidebar.tsx"
  "src\components\layout\CommandPalette.tsx"
  "src\components\ui\button.tsx"
  "src\components\ui\card.tsx"
  "src\components\ui\data-table.tsx"
  "src\components\ui\dialog.tsx"
  "src\components\ui\dropdown-menu.tsx"
  "src\components\ui\input.tsx"
  "src\components\ui\kpi-card.tsx"
  "src\components\ui\page-header.tsx"
  "src\components\ui\skeleton.tsx"
  "src\components\ui\switch.tsx"
  "src\components\ui\tabs.tsx"
  "src\components\ui\avatar.tsx"
  "src\routes\auth.tsx"
  "src\routes\_app.agenda.tsx"
  "src\routes\_app.cabos.tsx"
  "src\routes\_app.campanhas.tsx"
  "src\routes\_app.configuracoes.tsx"
  "src\routes\_app.dashboard.tsx"
  "src\routes\_app.eleitores.tsx"
  "src\routes\_app.equipe.tsx"
  "src\routes\_app.eventos.tsx"
  "src\routes\_app.financeiro.tsx"
  "src\routes\_app.liderancas.tsx"
  "src\routes\_app.mapa.tsx"
  "src\routes\_app.perfil.tsx"
  "src\routes\_app.pesquisas.tsx"
  "src\routes\_app.relatorios.tsx"
  "src\routes\_app.visitas.tsx"
  "src\routes\_app.whatsapp.tsx"
)

# We need to be careful about order - do more specific replacements first
$replacements = @(
  # Specific CSS var patterns (do these first to avoid partial matches)
  @('border-[var(--card-border)]/60', 'border-border/60'),
  @('border-[var(--sidebar-border)]', 'border-sidebar-border'),
  @('bg-[var(--bg-elevated)]', 'bg-card'),
  @('bg-[var(--bg)]/80', 'bg-background/80'),
  @('bg-[var(--card)]', 'bg-card'),
  @('bg-[var(--sidebar)]', 'bg-sidebar'),
  @('text-[var(--fg)]', 'text-foreground'),
  @('ring-[var(--bg)]', 'ring-background'),
  @('ring-[var(--card)]', 'ring-card'),
  @('fill="var(--card-border)"', 'fill="var(--border)"'),
  
  # hover patterns
  @('hover:bg-[var(--card-border)]/40', 'hover:bg-accent/40'),
  @('hover:bg-[var(--card-border)]/30', 'hover:bg-accent/30'),
  @('hover:bg-[var(--card-border)]/50', 'hover:bg-accent/50'),
  @('focus:bg-[var(--card-border)]/40', 'focus:bg-accent/40'),
  @('bg-[var(--card-border)]/40', 'bg-accent/40'),
  @('bg-[var(--card-border)]/30', 'bg-accent/30'),
  
  # Generic var(--card-border) -> var(--border) as CSS value
  @('var(--card-border)', 'var(--border)'),
  @('var(--bg-elevated)', 'var(--card)'),
  @('var(--bg)', 'var(--background)'),
  @('var(--fg)', 'var(--foreground)'),
  
  # color tokens
  @('var(--color-success)', 'var(--success)'),
  @('var(--color-warning)', 'var(--warning)'),
  @('var(--color-danger)', 'var(--danger)'),
  @('var(--color-info)', 'var(--info)'),
  
  # bg-success etc
  @('bg-[var(--color-success)]/15', 'bg-success/15'),
  @('bg-[var(--color-success)]', 'bg-success'),
  @('text-[var(--color-success)]', 'text-success'),
  
  # Classes
  @('text-muted-foreground', '<<KEEP>>'), # already correct - skip
  @('text-muted', 'text-muted-foreground'),
  @('text-danger', 'text-destructive'),
  @('bg-danger', 'bg-destructive'),
  @('bg-warning', 'bg-warning'),
  @('bg-info', 'bg-info'),
  
  # brand-xxx -> brand (simplified)
  @('ring-brand-500/40', 'ring-ring'),
  @('focus-visible:ring-brand-500/40', 'focus-visible:ring-ring'),
  @('focus-visible:ring-brand-500/50', 'focus-visible:ring-ring'),
  @('hover:border-brand-500/40', 'hover:border-brand/40'),
  @('bg-brand-500/10', 'bg-brand/10'),
  @('bg-brand-500/15', 'bg-brand/15'),
  @('bg-brand-500', 'bg-brand'),
  @('text-brand-600 dark:text-brand-300', 'text-brand'),
  @('text-brand-600', 'text-brand'),
  @('text-brand-500', 'text-brand'),
  @('text-brand-300', 'text-brand'),
  @('ring-brand-500/40', 'ring-ring'),
  @('bg-brand-500/10 ring-1 ring-brand-500/40', 'bg-brand/10 ring-1 ring-ring'),
  
  # Card class
  @('className="card space-y-3 p-5"', 'className="bg-card border border-border rounded-xl space-y-3 p-5"'),
  @('className="card divide-y divide-[var(--card-border)] p-2"', 'className="bg-card border border-border rounded-xl divide-y divide-border p-2"'),
  @('className="card overflow-hidden"', 'className="bg-card border border-border rounded-xl overflow-hidden"'),
  @('className={cn(', 'className={cn('),
  
  # shadow-glow
  @('shadow-glow', 'shadow-elegant'),
  @('hover:glow-ring', 'hover:shadow-elegant'),
  @('glow-ring', 'shadow-elegant'),
  
  # brand-gradient -> already in CSS, keep
  # generate-id for calendar days
  @('bg-brand-500/10 ring-1 ring-brand-500/40', 'bg-brand/10 ring-1 ring-ring'),
  
  # The card class usage in card.tsx
  @("'card'", "'bg-card border border-border rounded-xl'"),
  
  # Skeleton
  @('divide-[var(--card-border)]', 'divide-border'),
)

# Also need to handle the inline style patterns in charts
# For charts/index.tsx which wasn't found

foreach ($relPath in $files) {
  $fullPath = Join-Path "C:\Users\Mailson\Documents\Projetos\votogeralpulse" $relPath
  if (-not (Test-Path $fullPath)) {
    Write-Host "SKIP (not found): $relPath"
    continue
  }
  
  $content = Get-Content -Path $fullPath -Raw
  
  foreach ($pair in $replacements) {
    $old = $pair[0]
    $new = $pair[1]
    if ($new -eq "<<KEEP>>") { continue }
    $content = $content -replace [regex]::Escape($old), $new
  }
  
  Set-Content -Path $fullPath -Value $content -NoNewline
  Write-Host "DONE: $relPath"
}
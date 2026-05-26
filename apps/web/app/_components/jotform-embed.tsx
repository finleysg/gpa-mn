"use client"

import { useEffect } from "react"

type JotFormEmbedProps = {
    formId: string
    title: string
    initialHeight?: number
}

export function JotFormEmbed({ formId, title, initialHeight = 800 }: JotFormEmbedProps) {
    useEffect(() => {
        function handleIFrameMessage(e: MessageEvent) {
            if (typeof e.data !== "string") return
            const args = e.data.split(":")
            if (args.length < 2) return

            const targetId = args.length > 2 ? args[args.length - 1] : formId
            if (!targetId) return
            const iframe = document.getElementById(targetId) as HTMLIFrameElement | null
            if (!iframe) return

            switch (args[0]) {
                case "scrollIntoView":
                    iframe.scrollIntoView()
                    break
                case "setHeight": {
                    const height = Number.parseInt(args[1]!, 10)
                    if (!Number.isNaN(height)) {
                        iframe.style.height = `${height}px`
                    }
                    if (
                        typeof window !== "undefined" &&
                        "parentIFrame" in window &&
                        typeof (window as unknown as { parentIFrame?: { autoResize?: () => void } })
                            .parentIFrame?.autoResize === "function"
                    ) {
                        ;(
                            window as unknown as { parentIFrame: { autoResize: () => void } }
                        ).parentIFrame.autoResize()
                    }
                    break
                }
                case "collapseErrorPage":
                    if (iframe.clientHeight > window.innerHeight) {
                        iframe.style.height = `${window.innerHeight}px`
                    }
                    break
                case "reloadPage":
                    window.location.reload()
                    break
                case "loadScript": {
                    if (args.length < 3) return
                    let src = args[1]!
                    if (args.length > 3) {
                        src = `${args[1]}:${args[2]}`
                    }
                    const script = document.createElement("script")
                    script.src = src
                    script.type = "text/javascript"
                    document.body.appendChild(script)
                    break
                }
                case "exitFullscreen":
                    if (document.exitFullscreen) document.exitFullscreen()
                    break
            }
        }

        window.addEventListener("message", handleIFrameMessage, false)
        return () => window.removeEventListener("message", handleIFrameMessage)
    }, [formId])

    return (
        <iframe
            id={formId}
            name={formId}
            title={title}
            src={`https://form.jotform.com/${formId}`}
            allow="geolocation; microphone; camera; fullscreen; payment"
            allowFullScreen
            scrolling="no"
            style={{
                width: "1px",
                minWidth: "100%",
                maxWidth: "100%",
                display: "block",
                overflow: "hidden",
                height: `${initialHeight}px`,
                border: "none",
            }}
        />
    )
}
